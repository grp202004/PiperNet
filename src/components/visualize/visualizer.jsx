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

        clusterKeys = new Map(); // Map<string | number, string[]>
        clusterConvexHullPoints = new Map(); // Map<string | number, THREE.Vector3[]>
        clusterConvexHullObjects = new Map(); // Map<string | number, THREE.Object3D>

        renderGraph = () => {
            if (State.preferences.view === "3D") {
                return (
                    <ForceGraph3D
                        ref={this.graphRef}
                        graphData={State.graph.adapterGraph}
                        nodeResolution={20}
                        onBackgroundRightClick={() => {
                            this.clusterKeys = Util.getClusters("publish_time");
                        }}
                        nodeThreeObject={(nodeObject) => {
                            this.clusterKeys.forEach((value, key));
                            // this.nodeArray.push(
                            //     new THREE.Vector3(
                            //         nodeObject.x,
                            //         nodeObject.y,
                            //         nodeObject.z
                            //     )
                            // );
                            console.log(nodeObject);
                            return false;
                        }}
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
