import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import State from ".";
import {
    ForceGraphMethods,
    NodeObject,
    LinkObject,
} from "react-force-graph-3d";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils.js";
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

    lastObject3D!: THREE.Object3D;

    clusterDelegation() {
        this.threeScene.remove(this.lastObject3D);
        this.lastObject3D = new THREE.Object3D();
        this.convexHullObjects.forEach((value, key) => {
            this.lastObject3D.add(value);
        });
        this.threeScene.add(this.lastObject3D);
    }

    // explicitly called when all node's position have been added to the map
    get convexHullObjects(): Map<string | number, THREE.Object3D> {
        let newMap = new Map<string | number, THREE.Object3D>();
        State.cluster.attributePoints.forEach((value, key) => {
            if (value.length < 4) {
                newMap.set(key, new THREE.Object3D());
            } else {
                let convexHull = new ConvexGeometry(Array.from(value));
                newMap.set(key, this.createMesh(convexHull, key));
            }
        });
        return newMap;
    }

    private createMesh(
        geom: ConvexGeometry,
        name: string | number
    ): THREE.Object3D {
        // 实例化一个绿色的半透明的材质
        var meshMaterial = new THREE.MeshBasicMaterial({
            color: State.cluster.attributeColor.get(name),
            transparent: true,
            opacity: 0.2,
        });
        meshMaterial.side = THREE.DoubleSide; //将材质设置成正面反面都可见
        var wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true; //把材质渲染成线框

        // 将两种材质都赋给几何体
        var mesh = SceneUtils.createMultiMaterialObject(geom, [
            meshMaterial,
            wireFrameMat,
        ]);

        return mesh;
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
