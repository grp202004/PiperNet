import React from "react";
import { observer } from "mobx-react";
import ForceGraph3D, {
    ForceGraphMethods,
    LinkObject,
    NodeObject,
} from "react-force-graph-3d";
import ComponentRef from "../ComponentRef";
import State from "../../state";
import SpriteText from "three-spritetext";
import {
    ICustomLinkObject,
    ICustomNodeObject,
} from "../../state/GraphDelegate";

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

        graphDelegate = State.graphDelegate;

        hoverNodeCallback = (
            node: NodeObject | null,
            previousNode: NodeObject | null
        ) => {
            if (State.search.isPreviewing) return;
            // to avoid frequent refresh

            if (node === null) {
                State.interaction.currentlyHoveredNodeId = null;
            } else if (node !== previousNode) {
                let current: string = node.id as string;
                State.interaction.previouslyHoveredNodeId =
                    State.interaction.currentlyHoveredNodeId;
                State.interaction.currentlyHoveredNodeId = current;
            }
        };

        nodeLeftClickCallback = (node: NodeObject, event: MouseEvent) => {
            let nodeId = node.id as string;
            if (event.ctrlKey || event.shiftKey) {
                // multi-selection
                let index;
                // if already in the list of selected, remove
                if (
                    (index = State.interaction.selectedNodes.indexOf(
                        nodeId
                    )) !== -1
                ) {
                    State.interaction.selectedNodes.splice(index, 1);
                } else {
                    // if not in the list, add
                    State.interaction.selectedNodes.push(nodeId);
                }
            } else {
                // single select
                State.interaction.selectedNode = node.id as string;
            }
        };

        nodeRightClickCallback = (node: NodeObject, event: MouseEvent) => {
            State.interaction.selectedNode = node.id as string;
            State.preferences.rightClickPositionX = event.x;
            State.preferences.rightClickPositionY = event.y;
            State.preferences.rightClickBackgroundPanelOpen = false;
            State.preferences.rightClickNodePanelOpen = true;
            this.closeAllPanel();
        };

        backgroundClickCallback = (event: MouseEvent) => {
            // cancel all selection
            State.interaction.selectedNodes = [];
            State.preferences.rightClickNodePanelOpen = false;
            State.preferences.rightClickBackgroundPanelOpen = false;
            this.closeAllPanel();
        };

        backgroundRightClickCallback = (event: MouseEvent) => {
            State.preferences.rightClickPositionX = event.x;
            State.preferences.rightClickPositionY = event.y;
            State.preferences.rightClickNodePanelOpen = false;
            State.preferences.rightClickBackgroundPanelOpen = true;
            this.closeAllPanel();
        };

        computeNodeColor(_node: NodeObject) {
            let node = _node as ICustomNodeObject;
            if (node.hovered) {
                return State.css.node.highlightColor;
            } else if (node.selected) {
                return State.css.node.selectedColor;
            } else {
                return State.css.node.defaultColor;
            }
        }

        computeEdgeColor(_edge: LinkObject) {
            let edge = _edge as ICustomLinkObject;
            if (edge.hovered) {
                return State.css.edge.highlightColor;
            } else if (edge.selected) {
                return State.css.edge.selectedColor;
            } else {
                return State.css.edge.defaultColor;
            }
        }
        computeEdgeWidth(_edge: LinkObject) {
            let edge = _edge as ICustomLinkObject;
            if (edge.hovered) {
                return State.css.edge.highlightWidth;
            } else if (edge.selected) {
                return State.css.edge.highlightWidth;
            } else {
                return State.css.edge.defaultWidth;
            }
        }
        renderGraph = () => {
            if (State.preferences.view === "3D") {
                return (
                    <ForceGraph3D
                        // Data Segment
                        ref={this.graphRef}
                        graphData={this.state.visualizationGraph}
                        controlType={this.props.controlType}
                        // Node Visualization Segment
                        nodeLabel="id"
                        nodeRelSize={State.css.node.size}
                        nodeColor={this.computeNodeColor}
                        nodeVisibility={this.graphDelegate.nodeVisibility}
                        nodeResolution={State.css.node.resolution}
                        nodeThreeObjectExtend={true}
                        nodeThreeObject={(node) => {
                            const sprite = new SpriteText(`${node.id}`);
                            sprite.color = State.css.label.color;
                            sprite.textHeight = State.css.label.size;
                            sprite.visible = State.css.label.show;
                            return sprite;
                        }}
                        // Node Manipulation Segment
                        onNodeHover={this.hoverNodeCallback}
                        onNodeClick={this.nodeLeftClickCallback}
                        onNodeRightClick={this.nodeRightClickCallback}
                        onNodeDragEnd={(node) => {
                            node.fx = node.x;
                            node.fy = node.y;
                            node.fz = node.z;
                        }}
                        // Link Visualization Segment
                        linkVisibility={this.graphDelegate.linkVisibility}
                        linkWidth={this.computeEdgeWidth}
                        linkColor={this.computeEdgeColor}
                        // Graph Manipulation Segment
                        onBackgroundRightClick={
                            this.backgroundRightClickCallback
                        }
                        onBackgroundClick={this.backgroundClickCallback}
                        // Engine
                        onEngineTick={() =>
                            this.graphDelegate.clusterObject.clusterDelegation()
                        }
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
            // this.graphMethods.refresh();
        }

        closeAllPanel() {
            State.preferences.deleteEdgePanelOpen = false;
        }

        componentDidMount() {
            this.graphDelegate.mountDelegateMethods(this.graphMethods);
            ComponentRef.visualizer = this;
        }
    }
);
