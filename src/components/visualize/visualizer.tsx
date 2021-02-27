import React from "react";
import { observer } from "mobx-react";
import ForceGraph3D, {
    ForceGraphMethods,
    NodeObject,
} from "react-force-graph-3d";
import ComponentRef from "../ComponentRef";
import State from "../../state";
import SpriteText from "three-spritetext";

interface Props {
    controlType: "trackball" | "orbit" | "fly";
}

export default observer(
    class ThreeJSVis extends React.Component<Props, {}> {
        state = {
            visualizationGraph: State.graphDelegate.visualizationGraph(),
        };
        // @ts-ignore
        graphRef: React.MutableRefObject<ForceGraphMethods> = React.createRef();

        get graphMethods(): ForceGraphMethods {
            return this.graphRef.current;
        }

        getNodeId(node: NodeObject): string {
            let nodeId: string;
            if (node.id as string) {
                nodeId = node.id as string;
            } else {
                nodeId = (node.id as number).toString();
            }
            return nodeId;
        }

        graphDelegate = State.graphDelegate;

        nodeHover = (
            node: NodeObject | null,
            previousNode: NodeObject | null
        ) => {
            if (State.search.isPreviewing) return;
            if (node != null && node !== previousNode) {
                State.graph.currentlyHoveredId = this.getNodeId(
                    node as NodeObject
                );
            }
        };

        // ref of State.graph.selectedNodes
        selectedNodes: string[] = State.graph.selectedNodes;

        nodeSelect = (node: NodeObject, event: MouseEvent) => {
            let nodeId = this.getNodeId(node as NodeObject);
            if (event.ctrlKey || event.shiftKey) {
                // multi-selection
                if (this.selectedNodes.includes(nodeId)) {
                    let index = this.selectedNodes.indexOf(nodeId);
                    if (index > -1) {
                        this.selectedNodes.splice(index, 1);
                    }
                } else {
                    this.selectedNodes.push(nodeId);
                }
            } else {
                // single-selection
                // TODO
            }
            this.graphMethods.refresh(); // update color of selected nodes
        };

        nodeRightClick = (node: NodeObject, event: MouseEvent) => {
            State.graph.selectedNode = node.id as string;
            State.preferences.rightClickPositionX = event.x;
            State.preferences.rightClickPositionY = event.y;
            State.preferences.rightClickBackgroundPanelOpen = false;
            State.preferences.rightClickNodePanelOpen = true;
        };

        backgroundRightClick = (event: MouseEvent) => {
            State.preferences.rightClickPositionX = event.x;
            State.preferences.rightClickPositionY = event.y;
            State.preferences.rightClickNodePanelOpen = false;
            State.preferences.rightClickBackgroundPanelOpen = true;
        };

        renderGraph = () => {
            if (State.preferences.view === "3D") {
                return (
                    <ForceGraph3D
                        ref={this.graphRef}
                        graphData={this.state.visualizationGraph}
                        nodeLabel="id"
                        nodeRelSize={State.css.node.size}
                        nodeThreeObjectExtend={true}
                        nodeThreeObject={(node) => {
                            // extend link with text sprite
                            const sprite = new SpriteText(`${node.id}`);
                            sprite.color = State.css.label.color;
                            sprite.textHeight = State.css.label.size;
                            sprite.visible = State.css.label.show;
                            return sprite;
                        }}
                        nodeResolution={State.css.node.resolution}
                        nodeVisibility={this.graphDelegate.nodeVisibility}
                        linkVisibility={this.graphDelegate.linkVisibility}
                        onNodeDragEnd={(node) => {
                            node.fx = node.x;
                            node.fy = node.y;
                            node.fz = node.z;
                        }}
                        onBackgroundRightClick={this.backgroundRightClick}
                        linkWidth={(link) => {
                            return State.graphDelegate.ifHighlightLink(
                                link,
                                2,
                                0.1,
                                1
                            );
                        }}
                        linkColor={(link) => {
                            return State.graphDelegate.ifHighlightLink(
                                link,
                                "orangered",
                                "white",
                                "white"
                            );
                        }}
                        linkDirectionalParticles={(link) => {
                            return State.graphDelegate.ifHighlightLink(
                                link,
                                4,
                                0,
                                0
                            );
                        }}
                        linkDirectionalParticleWidth={4}
                        onEngineTick={() =>
                            this.graphDelegate.clusterObject.clusterDelegation()
                        }
                        nodeColor={(node) =>
                            this.selectedNodes.includes(this.getNodeId(node))
                                ? State.css.node.selectedColor
                                : State.css.node.defaultColor
                        }
                        onNodeClick={this.nodeSelect}
                        onNodeRightClick={this.nodeRightClick}
                        onBackgroundClick={() => {
                            State.preferences.rightClickNodePanelOpen = false;
                            State.preferences.rightClickBackgroundPanelOpen = false;
                        }}
                        onNodeHover={this.nodeHover}
                        controlType={this.props.controlType}
                    />
                );
                // } else {
                //     return (
                //         <ForceGraph2D
                //             graphData={State.graph.adapterGraph}
                //             dagMode={"td"}
                //             // dagLevelDistance={300}
                //             // backgroundColor="#101020"
                //             nodeRelSize={1}
                //             // nodeId="path"
                //             // nodeVal={(node) => 100 / (node.level + 1)}
                //             // nodeLabel="path"
                //             // nodeAutoColorBy="module"
                //             // linkDirectionalParticles={2}
                //             // linkDirectionalParticleWidth={2}
                //             d3VelocityDecay={0.3}
                //         />
                //     );
            }
        };

        render() {
            return <div>{this.renderGraph()}</div>;
        }

        updateVisualizationGraph() {
            this.setState({
                visualizationGraph: State.graphDelegate.visualizationGraph(),
            });
        }

        componentDidMount() {
            this.graphDelegate.mountDelegateMethods(this.graphMethods);
            ComponentRef.visualizer = this;
        }
    }
);
