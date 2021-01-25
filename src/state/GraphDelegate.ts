import React, { useEffect } from "react";
import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import State from ".";
import {
    ForceGraphMethods,
    NodeObject,
    LinkObject,
} from "react-force-graph-3d";

import * as graphology from "graphology-types";
import * as THREE from "three";

export interface CustomNodeObject extends NodeObject {
    name?: string;
    val?: number;
}

export default class GraphDelegate {
    constructor(_graphDelegateMethods: ForceGraphMethods) {
        this.graphDelegateMethods = _graphDelegateMethods;
        this.threeScene = this.graphDelegateMethods.scene();
        makeAutoObservable(this);
    }

    private graphDelegateMethods: ForceGraphMethods;

    private threeScene: THREE.Scene;

    get rawGraph(): Graph {
        return State.graph.rawGraph;
    }

    get convexHullObjects(): Map<string, THREE.Object3D> {
        return State.cluster.computeConvexHullObjects;
    }

    init() {
        this.convexHullObjects.forEach((value, key) => {
            this.threeScene.add(value);
        });
    }

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
