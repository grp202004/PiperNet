import React from "react";
import { observer } from "mobx-react";
import {
    ForceGraph2D,
    ForceGraph3D,
    ForceGraphVR,
    ForceGraphAR,
} from "react-force-graph";
import State from "../../state";
import * as THREE from "three";

export default observer(
    class ThreeJSVis extends React.Component {
        graphRef = React.createRef(); // Map<string | number, THREE.Object3D>

        renderGraph = () => {
            if (State.preferences.view === "3D") {
                return (
                    <ForceGraph3D
                        ref={this.graphRef}
                        graphData={State.graph.adapterGraph}
                        nodeResolution={20}
                        onNodeDragEnd={(node) => {
                            node.fx = node.x;
                            node.fy = node.y;
                            node.fz = node.z;
                        }}
                        // onBackgroundRightClick={() => {
                        //     this.clusterKey_AttributeMap = Util.getClusters(
                        //         "publish_time"
                        //     );
                        //     console.log(this.clusterKey_AttributeMap);
                        //     this.clusterAttributesSet = new Set(
                        //         Array.from(
                        //             this.clusterKey_AttributeMap.values()
                        //         )
                        //     );
                        //     this.clusterAttribute_PointsMap = new Map();
                        //     for (let attribute of this.clusterAttributesSet) {
                        //         // 遍历Map
                        //         this.clusterAttribute_PointsMap.set(
                        //             attribute,
                        //             new Set()
                        //         );
                        //     }
                        //     this.graphRef.current.refresh();
                        //     this.graphRef.current.pauseAnimation();
                        // }}
                        onBackgroundClick={() => {
                            // this.graphRef.current.pauseAnimation();
                            State.cluster.computeConvexHullObjects();
                            this.graphRef.current.refresh();
                        }}
                        nodeThreeObject={(nodeObject) => {
                            if (nodeObject.id.includes("_CLUSTER_")) {
                                return State.cluster.convexHullObjects.get(
                                    nodeObject.id
                                );

                                return false;
                            } else {
                                State.cluster.addPoints(
                                    nodeObject.id,
                                    nodeObject.x,
                                    nodeObject.y,
                                    nodeObject.z
                                );
                                return false;
                            }
                        }}
                        // nodeThreeObject={(nodeObject) => {
                        //     if (nodeObject.id.includes("_CLUSTER_")) {
                        //         let position = State.cluster.centerPoints.get(
                        //             nodeObject.id
                        //         );
                        //         nodeObject.fx = position.x;
                        //         nodeObject.fy = position.y;
                        //         nodeObject.fz = position.z;

                        //         return false;
                        //     } else {
                        //         State.cluster.addPoints(
                        //             nodeObject.id,
                        //             nodeObject.x,
                        //             nodeObject.y,
                        //             nodeObject.z
                        //         );
                        //         return false;
                        //     }
                        // }}
                    />
                );
            } else {
                return (
                    <ForceGraph2D
                        graphData={State.graph.adapterGraph}
                        dagMode={"td"}
                        // dagLevelDistance={300}
                        // backgroundColor="#101020"
                        nodeRelSize={1}
                        // nodeId="path"
                        // nodeVal={(node) => 100 / (node.level + 1)}
                        // nodeLabel="path"
                        // nodeAutoColorBy="module"
                        // linkDirectionalParticles={2}
                        // linkDirectionalParticleWidth={2}
                        d3VelocityDecay={0.3}
                    />
                );
            }
        };

        render() {
            return <div>{this.renderGraph()}</div>;
        }

        // componentDidMount() {
        //     Graph.graphRef = this.graphRef;
        // }
    }
);
