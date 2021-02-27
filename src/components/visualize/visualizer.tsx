import React from "react";
import { observer } from "mobx-react";
import ForceGraph3D, {
    ForceGraphMethods,
    NodeObject,
} from "react-force-graph-3d";
import ComponentRef from "../ComponentRef";
import State from "../../state";
import { NodeKey } from "graphology-types";

export default observer(
    class ThreeJSVis extends React.Component {
        state = {
            visualizationGraph: State.graphDelegate.visualizationGraph(),
        };
        // @ts-ignore
        graphRef: React.MutableRefObject<ForceGraphMethods> = React.createRef();

        get graphMethods(): ForceGraphMethods {
            return this.graphRef.current;
        }

        // getNeighbors(node: NodeObject): string[] {
        //     if ((node.id as string) === "") {
        //         return [];
        //     }
        //     let neighbors: string[] = [];
        //     State.graph.rawGraph.forEachNeighbor(
        //         node.id as string,
        //         (neighbor) => {
        //             neighbors.push(neighbor);
        //         }
        //     );
        //     return neighbors;
        // }

        graphDelegate = State.graphDelegate;

        nodeHover = (
            node: NodeObject | null,
            previousNode: NodeObject | null
        ) => {
            if (State.search.isPreviewing) return;
            if (node != null && node !== previousNode) {
                let current: string = State.graph.getNodeId(node as NodeObject);

                State.graph.currentlyHoveredId = current;
                //get neighbors of this node
                State.graphDelegate.neighborNodeids = State.graph.getNeighbors(
                    current
                );

                if (
                    State.graph.currentlyHoveredId !==
                        State.graph.previouslyHoverdId ||
                    State.graph.previouslyHoverdId === null
                ) {
                    //     State.graph.currentlyHoveredNeighbors = State.graph.getNeighbors(
                    //         current
                    //     );
                    //     State.graph.edgesOfCurrentlyHoveredNode = State.graph.getEdgesOfNode(
                    //         current
                    //     );
                    //     if (State.graph.previouslyHoverdId !== null) {
                    //         State.graph.setNodeColor(
                    //             State.graph.previouslyHoverdId,
                    //             State.graph.defaultStyle.node.color
                    //         );
                    //         //set node style of previous node
                    //         if (
                    //             State.graph.previouslyHoveredNeighbors !== null &&
                    //             State.graph.previouslyHoveredNeighbors?.length !== 0
                    //         ) {
                    //             State.graph.setNodesColor(
                    //                 State.graph.previouslyHoveredNeighbors,
                    //                 State.graph.defaultStyle.node.color
                    //             );
                    //         }
                    //         //set edge style of previous node
                    //         if (
                    //             State.graph.edgesOfPreviouslyHoveredNode !== null &&
                    //             State.graph.edgesOfPreviouslyHoveredNode?.length !==
                    //                 0
                    //         ) {
                    //             State.graph.setEdgesColor(
                    //                 State.graph.edgesOfPreviouslyHoveredNode,
                    //                 State.graph.defaultStyle.edge.color
                    //             );
                    //             State.graph.setEdgesWidth(
                    //                 State.graph.edgesOfPreviouslyHoveredNode,
                    //                 State.graph.defaultStyle.edge.width
                    //             );
                    //         }
                    //     }
                    //     //set node and edge style of current hovered node
                    //     State.graph.setNodeColor(current, "white");
                    //     // State.graph.setNeighborColor(current, "#3399FF");
                    //     State.graph.setNodesColor(
                    //         State.graph.currentlyHoveredNeighbors,
                    //         "#3399FF"
                    //     );
                    //     State.graph.setEdgesColor(
                    //         State.graph.edgesOfCurrentlyHoveredNode,
                    //         "yellow"
                    //     );
                    //     State.graph.setEdgesWidth(
                    //         State.graph.edgesOfCurrentlyHoveredNode,
                    //         4
                    //     );
                    //     //update the data
                    //     State.graph.previouslyHoverdId = current;
                    //     State.graph.previouslyHoveredNeighbors =
                    //         State.graph.currentlyHoveredNeighbors;
                    //     State.graph.edgesOfPreviouslyHoveredNode =
                    //         State.graph.edgesOfCurrentlyHoveredNode;
                    State.graph.highlightNodeHovered(current, {
                        nodeStyle: {
                            color: "white",
                            neighborColor: "#3399FF",
                            // opacity: 0.75,
                        },
                        edgeStyle: {
                            color: "yellow",
                            width: 4,
                            linkDirectionalParticles: 4,
                        },
                    });
                }

                this.graphMethods.refresh();
            }

            // console.log(State.graph.rawGraph); //for test
        };

        // ref of State.graph.selectedNodes
        selectedNodes: string[] = State.graph.selectedNodes;

        nodeSelect = (node: NodeObject, event: MouseEvent) => {
            let nodeId = State.graph.getNodeId(node as NodeObject);
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
            // this.graphMethods.refresh(); // update color of selected nodes
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
                        nodeResolution={20}
                        nodeVisibility={this.graphDelegate.nodeVisibility}
                        linkVisibility={this.graphDelegate.linkVisibility}
                        onNodeDragEnd={(node) => {
                            node.fx = node.x;
                            node.fy = node.y;
                            node.fz = node.z;
                        }}
                        onBackgroundRightClick={this.backgroundRightClick}
                        linkWidth="edgeWidth"
                        // linkColor={(link) => {
                        //     return State.graphDelegate.ifHighlightLink(
                        //         link,
                        //         "orangered",
                        //         "white",
                        //         "white"
                        //     );
                        // }}
                        linkColor="edgeColor" //used for test
                        linkDirectionalParticles="linkDirectionalParticles"
                        linkDirectionalParticleWidth={4}
                        onEngineTick={() =>
                            this.graphDelegate.clusterDelegation()
                        }
                        // nodeColor={(node) =>
                        //     this.selectedNodes.includes(this.getNodeId(node))
                        //         ? "yellow"
                        //         : "grey"
                        // }

                        nodeColor="nodeColor"
                        onNodeClick={this.nodeSelect}
                        onNodeRightClick={this.nodeRightClick}
                        onBackgroundClick={() => {
                            State.preferences.rightClickNodePanelOpen = false;
                            State.preferences.rightClickBackgroundPanelOpen = false;
                        }}
                        onNodeHover={this.nodeHover}
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
