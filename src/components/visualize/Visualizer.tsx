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
import { reaction } from "mobx";
import { VisualizationMode } from "../../state/PreferencesStore";
import SelectionBox from "../panels/SelectionBox";
import * as CustomMouseEvent from "../../state/utils/MouseEventUtils";
import CanvasDrawPanel from "../panels/CanvasDrawPanel";
import { createToaster } from "../../state/utils/ToasterUtils";
import { Position } from "@blueprintjs/core";
import CanvasDrawStraightLinePanel from "../panels/CanvasDrawStraightLinePanel";

export default observer(
    class ThreeJSVis extends React.Component {
        state = {
            visualizationGraph: State.graphDelegate.visualizationGraph(),
            nodePointerInteraction: true,
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
                State.interaction.currentlyHoveredNodeId = current;
            }
            // console.log(State.graph.rawGraph);
        };

        nodeLeftClickCallback = (node: NodeObject, event: MouseEvent) => {
            if (!this.state.nodePointerInteraction) {
                return;
            }
            let nodeId = node.id as string;
            if (
                State.preferences.visualizationMode ===
                VisualizationMode.NodeSelection
            ) {
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
                State.interaction.selectedNodes = [node.id as string];
            }
        };

        nodeRightClickCallback = (node: NodeObject, event: MouseEvent) => {
            if (!this.state.nodePointerInteraction) {
                return;
            }
            State.interaction.selectedNode = node.id as string;
            State.preferences.rightClickPositionX = event.x;
            State.preferences.rightClickPositionY = event.y;
            State.preferences.rightClickOn = "Node";
            State.preferences.rightClickPanelOpen = true;
            State.preferences.closeAllPanel("rightClickPanel");
        };

        backgroundClickCallback = () => {
            // cancel all selection
            State.interaction.flush();
            State.interaction.selectedNodes = [];
            State.preferences.rightClickPanelOpen = false;
            State.preferences.closeAllPanel("rightClickPanel");
        };

        backgroundRightClickCallback = (event: MouseEvent) => {
            if (!this.state.nodePointerInteraction) {
                return;
            }
            State.preferences.rightClickPositionX = event.x;
            State.preferences.rightClickPositionY = event.y;
            State.preferences.rightClickOn = "Background";
            State.preferences.rightClickPanelOpen = true;
            State.preferences.closeAllPanel("rightClickPanel");
        };

        computeNodeColor(_node: NodeObject) {
            let node = _node as ICustomNodeObject;
            if (node.hovered) {
                return State.css.node.highlightColor;
            } else if (node.selected) {
                return State.css.node.selectedColor;
            } else if (node.multiSelected) {
                return State.css.node.multiSelectedColor;
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

        renderDrawCanvas = () => {
            if (State.clusterInteraction.drawStraightLine) {
                return <CanvasDrawStraightLinePanel />;
            } else {
                return <CanvasDrawPanel />;
            }
        };

        renderGraph = () => {
            return (
                <div>
                    {State.preferences.visualizationMode ===
                        VisualizationMode.NodeSelection &&
                        State.interaction.boxSelectionOpen && <SelectionBox />}
                    {State.preferences.visualizationMode ===
                        VisualizationMode.ClusterSplitting &&
                        State.clusterInteraction.drawPanelActivate &&
                        this.renderDrawCanvas()}
                    <ForceGraph3D
                        // Data Segment
                        ref={this.graphRef}
                        graphData={this.state.visualizationGraph}
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
                            sprite.backgroundColor = "";
                            sprite.visible = State.css.label.show;
                            sprite.translateX(State.css.node.size + 2);
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
                        enablePointerInteraction={
                            this.state.nodePointerInteraction
                        }
                        // Engine
                        onEngineTick={() => {
                            State.graphDelegate.clusterObject.canAlterNodePosition = true;
                            this.graphDelegate.clusterObject.clusterDelegation();
                        }}
                        cooldownTicks={100}
                        onEngineStop={() => {
                            if (
                                State.css.cluster.shape === "sphere" &&
                                State.graphDelegate.clusterObject
                                    .canAlterNodePosition
                            ) {
                                console.log(
                                    "starts to plot points on the surface of the sphere"
                                );
                                this.graphDelegate.clusterObject.alterNodePosition();
                                State.graphDelegate.clusterObject.canAlterNodePosition = false;
                            }
                        }}
                    />
                </div>
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
        };

        render() {
            return <div>{this.renderGraph()}</div>;
        }

        updateVisualizationGraph() {
            this.setState({
                visualizationGraph: State.graphDelegate.visualizationGraph(),
            });
        }

        clusterInteractionListener(set: boolean) {
            if (set) {
                document.addEventListener(
                    "mousemove",
                    CustomMouseEvent.onDocumentMouseMove
                );
                document.addEventListener(
                    "click",
                    CustomMouseEvent.onDocumentLeftClick
                );
                document.addEventListener(
                    "contextmenu",
                    CustomMouseEvent.onDocumentRightClick
                );
                console.log("MouseEvent listening");
            } else {
                document.removeEventListener(
                    "mousemove",
                    CustomMouseEvent.onDocumentMouseMove
                );
                document.removeEventListener(
                    "click",
                    CustomMouseEvent.onDocumentLeftClick
                );
                document.removeEventListener(
                    "contextmenu",
                    CustomMouseEvent.onDocumentRightClick
                );
                console.log("MouseEvent stop listening");
            }
        }

        componentDidMount() {
            this.graphDelegate.mountDelegateMethods(this.graphMethods);
            this.clusterInteractionListener(true);
            ComponentRef.visualizer = this;
        }
    }
);

reaction(
    () => State.preferences.visualizationMode,
    (visualizationMode) => {
        switch (visualizationMode) {
            case VisualizationMode.Normal:
                ComponentRef.visualizer?.setState({
                    nodePointerInteraction: true,
                });
                State.interaction.flush();
                State.clusterInteraction.flush();
                ComponentRef.visualizer?.clusterInteractionListener(true);
                break;

            case VisualizationMode.NodeSelection:
                ComponentRef.visualizer?.setState({
                    nodePointerInteraction: true,
                });
                State.interaction.flush();
                State.clusterInteraction.flush();
                ComponentRef.visualizer?.clusterInteractionListener(false);
                createToaster(
                    <p>
                        Select one or more <b>Nodes</b> and <b>Right-click</b>{" "}
                        on one of them to open <b>Context Menu</b>
                    </p>,
                    Position.BOTTOM,
                    10000
                );
                break;

            case VisualizationMode.ClusterSelection:
                ComponentRef.visualizer?.setState({
                    nodePointerInteraction: false,
                });
                State.interaction.flush();
                State.clusterInteraction.flush();
                ComponentRef.visualizer?.clusterInteractionListener(true);
                createToaster(
                    <p>
                        Select one or more <b>Clusters</b> and{" "}
                        <b>Right-click</b> on one of them to open{" "}
                        <b>Context Menu</b>
                    </p>,
                    Position.BOTTOM,
                    10000
                );
                break;

            case VisualizationMode.ClusterSplitting:
                ComponentRef.visualizer?.setState({
                    nodePointerInteraction: false,
                });
                State.interaction.flush();
                State.clusterInteraction.flush();
                ComponentRef.visualizer?.clusterInteractionListener(true);
                State.helper.clusterSplittingPanelStackOpen = true;
                break;
        }
    }
);
