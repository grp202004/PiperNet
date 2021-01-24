import React from "react";
import { observer } from "mobx-react";
import ForceGraph3D from "react-force-graph-3d";
import State from "../../state";
import * as THREE from "three";

export default observer(
    class ThreeJSVis extends React.Component {
        // @ts-ignore
        graphRef = React.createRef();
        forceGraph = this.graphRef.current;

        allAdded = false;

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
                        // onBackgroundClick={() => {
                        //     this.allAdded = true;
                        //     // this.graphRef.current.pauseAnimation();
                        //     State.cluster.computeConvexHullObjects();
                        //     console.log(this.graphRef.current.graphData());
                        //     this.graphRef.current.refresh();
                        // }}
                        nodeThreeObjectExtend={true}
                        nodeThreeObject={(nodeObject) => {
                            let geometry = new THREE.SphereGeometry(10);
                            var draw_object = new THREE.Mesh(
                                geometry,
                                new THREE.MeshPhongMaterial({
                                    color: "#3d79ff",
                                    //transparent: true,
                                    opacity: 0.1,
                                    shininess: 4,
                                })
                            );
                            return draw_object;

                            // if (this.allAdded) {
                            //     if (nodeObject.id.includes("_CLUSTER_")) {
                            //         let thisObject = State.cluster.convexHullObjects.get(
                            //             nodeObject.id
                            //         );
                            //         console.log(thisObject);
                            //         // thisObject.position = new THREE.Vector3(
                            //         //     2,
                            //         //     2,
                            //         //     2
                            //         // );
                            //         return thisObject;
                            //     } else {
                            //         return false;
                            //     }
                            // } else {
                            //     if (nodeObject.id.includes("_CLUSTER_")) {
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
                            // }
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

        // componentDidMount() {
        //     Graph.graphRef = this.graphRef;
        // }
    }
);
