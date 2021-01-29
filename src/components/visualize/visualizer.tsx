import React from "react";
import {
    observable,
    makeObservable,
    computed,
    autorun,
    action,
    makeAutoObservable,
} from "mobx";
import { observer } from "mobx-react";
import ForceGraph3D, {
    ForceGraphMethods,
    NodeObject,
} from "react-force-graph-3d";
import State from "../../state";
import ComponentRef from "../ComponentRef";
import GraphDelegate from "./GraphDelegate";

export default observer(
    class ThreeJSVis extends React.Component {
        constructor(props: any) {
            super(props);
            makeObservable(this, {
                graphRef: observable,
                graphMethods: computed,
                graphDelegate: observable,
                nodeHover: action,
            });
        }
        // @ts-ignore
        graphRef: React.MutableRefObject<ForceGraphMethods> = React.createRef();
        get graphMethods(): ForceGraphMethods {
            return this.graphRef.current;
        }

        graphDelegate = new GraphDelegate();

        nodeHover = (
            node: NodeObject | null,
            previousNode: NodeObject | null
        ) => {
            if (node != null && node != previousNode) {
                node = node as NodeObject;
                let nodeId: string;
                if (node.id as string) {
                    nodeId = node.id as string;
                } else {
                    nodeId = (node.id as number).toString();
                }
                State.graph.currentlyHoveredId = nodeId;
                console.log(State.graph.currentlyHoveredId);
                ComponentRef.nodeDetail?.forceUpdate();
            }
        };

        renderGraph = () => {
            if (State.preferences.view === "3D") {
                return (
                    <ForceGraph3D
                        ref={this.graphRef}
                        graphData={this.graphDelegate.visualizationGraph}
                        nodeResolution={20}
                        nodeVisibility={this.graphDelegate.nodeVisibility}
                        linkVisibility={this.graphDelegate.linkVisibility}
                        onNodeDragEnd={(node) => {
                            node.fx = node.x;
                            node.fy = node.y;
                            node.fz = node.z;
                        }}
                        onBackgroundClick={() => {
                            // this.allAdded = true;
                            // this.graphRef.current.pauseAnimation();
                            // this.graphMethods.refresh();
                            // this.graphDelegate.init();
                        }}
                        onBackgroundRightClick={() => {
                            // this.allAdded = true;
                            // this.graphRef.current.pauseAnimation();
                            // this.graphMethods.refresh();
                            // this.graphDelegate.init();
                        }}
                        onEngineTick={() =>
                            this.graphDelegate.clusterDelegation()
                        }
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

        componentDidMount() {
            this.graphDelegate.mountDelegateMethods(this.graphMethods);
        }
    }
);
