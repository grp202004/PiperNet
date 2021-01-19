import React from "react";
import { observer } from "mobx-react";
import {
    ForceGraph2D,
    ForceGraph3D,
    ForceGraphVR,
    ForceGraphAR,
} from "react-force-graph";
import State from "../../state";
import Graph from "./Graph";
import * as THREE from "three";
import * as Util from "./VisualizeUtils";

export default observer(
    class ThreeJSVis extends React.Component {
        graphRef = React.createRef();

        clusterKey_AttributeMap = new Map(); // Map<string, string | number>
        clusterAttributesSet = new Set(); // Set<string | number>
        clusterAttribute_PointsMap = new Map(); // Map<string | number, THREE.Vector3[]>
        clusterConvexHullObjects = new Map(); // Map<string | number, THREE.Object3D>

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
                        //     let clusterObjects = Util.computeConvexHull(
                        //         this.clusterAttribute_PointsMap
                        //     );
                        //     clusterObjects.forEach((clusterObject) => {
                        //         this.graphRef.current
                        //             .scene()
                        //             .add(clusterObject);
                        //     });
                        //     this.graphRef.current.refresh();
                        // }}
                        // nodeThreeObject={(nodeObject) => {
                        //     console.log(nodeObject);
                        //     for (let [key, value] of this
                        //         .clusterKey_AttributeMap) {
                        //         if (key == nodeObject.id) {
                        //             this.clusterAttribute_PointsMap
                        //                 .get(value)
                        //                 .add(
                        //                     new THREE.Vector3(
                        //                         nodeObject.x,
                        //                         nodeObject.y,
                        //                         nodeObject.z
                        //                     )
                        //                 );
                        //             break;
                        //         }
                        //     }
                        //     console.log(this.clusterAttribute_PointsMap);
                        //     return false;
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
