import React, { useEffect } from "react";
import { observable, computed, makeObservable } from "mobx";
import State from "../../state";
import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import * as THREE from "three";

class Graph {
    //@ts-ignore
    // graphRef: React.MutableRefObject<ForceGraphMethods$2>;
    // get graph(): ForceGraphMethods$2 {
    //     return this.graphRef.current;
    // }
    // nodeArray: THREE.Vector3[] = [];
    // Graph = ForceGraph3D()(document.getElementById("graph"))
    //     .graphData(data)
    //     .nodeId("key")
    //     .nodeRelSize(10)
    //     .nodeVal(1)
    //     .linkCurvature(0.2)
    //     .linkWidth(linkWidth)
    //     .linkColor(linkColor)
    //     .nodeCanvasObject(node)
    //     .d3VelocityDecay(0.2)
    //     .d3AlphaDecay(0.01)
    //     .cooldownTime(20000)
    //     .onNodeHover(nodeHover)
    //     .onNodeClick((node) => {
    //         locked = true;
    //         hover = node.key;
    //     })
    //     .onBackgroundClick(() => {
    //         locked = false;
    //     })
    //     .enableNodeDrag(false);
    // //.enablePointerInteraction(false);
    // constructor() {
    //     makeObservable(this, {
    //         graphRef: observable,
    //         graph: computed,
    //     });
    // }
}

export default new Graph();
