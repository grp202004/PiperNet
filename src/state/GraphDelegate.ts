import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import { copy } from "copy-anything";
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
    isClusterNode?: boolean;
}

export interface CustomLinkObject extends LinkObject {
    isClusterLink?: boolean;
}

export default class GraphDelegate {
    constructor() {
        makeAutoObservable(this);
    }

    mountDelegateMethods(_graphDelegateMethods: ForceGraphMethods) {
        this.graphDelegateMethods = _graphDelegateMethods;
        this.threeScene = this.graphDelegateMethods.scene();
    }

    private graphDelegateMethods!: ForceGraphMethods;

    private threeScene!: THREE.Scene;

    get visualizationGraph() {
        let newGraph = State.graph.decorateRawGraph(
            this.addInvisibleClusterNode(this.rawGraph)
        );
        newGraph.forEachNode((node, attributes) => {
            if (node.includes("_CLUSTER_")) {
                attributes._visualize.isClusterNode = true;
            }
        });
        newGraph.forEachEdge((edge, attributes, source, target) => {
            if (source.includes("_CLUSTER_") || target.includes("_CLUSTER_")) {
                attributes._visualize.isClusterLink = true;
            }
        });
        let tempGraph = {
            nodes: [] as CustomNodeObject[],
            links: [] as LinkObject[],
        };
        newGraph.forEachNode((node, attributes) => {
            tempGraph.nodes.push(attributes["_visualize"]);
        });

        newGraph.forEachEdge((edge, attributes) => {
            tempGraph.links.push(attributes["_visualize"]);
        });
        return tempGraph;
    }

    addInvisibleClusterNode(oldGraph: Graph): Graph {
        let graphCopy = copy(oldGraph);
        let names = [
            "_CLUSTER_1_",
            "_CLUSTER_2_",
            "_CLUSTER_3_",
            "_CLUSTER_4_",
            "_CLUSTER_5_",
            "_CLUSTER_6_",
            "_CLUSTER_7_",
            "_CLUSTER_8_",
            "_CLUSTER_9_",
            "_CLUSTER_10_",
        ];
        for (let index = 0; index < names.length; index++) {
            State.cluster.getAttributeValues.forEach((attribute) => {
                if (attribute === "undefined") return;
                let clusterID = names[index] + attribute;
                graphCopy.addNode(clusterID);
                State.cluster.attributeKeys.get(attribute)?.forEach((value) => {
                    let visualize: CustomLinkObject = {
                        isClusterLink: true,
                    };
                    graphCopy.addEdge(clusterID, value, {
                        _visualize: visualize,
                    });
                });
            });
        }

        return graphCopy;
    }

    nodeVisibility = (nodeObject: CustomNodeObject) => {
        return nodeObject.isClusterNode ? false : true;
    };

    linkVisibility = (nodeObject: CustomLinkObject) => {
        return nodeObject.isClusterLink ? false : true;
    };

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

    ////

    cameraFocusOn(nodeId: string) {
        let node = State.graph.rawGraph.getNodeAttribute(nodeId, "_visualize");
        if (!(node.x && node.y && node.z)) return;
        // Aim at node from outside it
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        this.graphDelegateMethods.cameraPosition(
            {
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio,
            }, // new position
            { x: node.x, y: node.y, z: node.z }, // lookAt ({ x, y, z })
            3000 // ms transition duration
        );
    }
}
