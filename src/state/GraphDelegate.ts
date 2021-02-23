import { makeAutoObservable, observable } from "mobx";
import Graph from "graphology";
import State from ".";
import {
    ForceGraphMethods,
    LinkObject,
    NodeObject,
} from "react-force-graph-3d";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils.js";
import * as THREE from "three";
import { copy } from "copy-anything";

export interface CustomNodeObject extends NodeObject {
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

    /**
     * assign the force-graph methods to this class
     * should be called as long as the visualizer react component is mounted
     *
     * @param {ForceGraphMethods} _graphDelegateMethods
     */
    mountDelegateMethods(_graphDelegateMethods: ForceGraphMethods) {
        this.graphDelegateMethods = _graphDelegateMethods;
        this.threeScene = this.graphDelegateMethods.scene();
    }

    /**
     * the ForceGraphMethods exposed by the visualization force-graph
     *
     * @see ForceGraphMethods
     *
     * @type {ForceGraphMethods}
     */
    graphDelegateMethods!: ForceGraphMethods;

    /**
     * the THREE.js WebGL Scene of the visualization
     *
     * @type {THREE.Scene}
     */
    threeScene!: THREE.Scene;

    /**
     * compute the delegate graph that will be used by the ForceGraph3D
     * will add invisible cluster nodes and edges to balance the clustered graph and adjust force
     * the NodeObject and LinkObject inside attributes (named _visualize) will be used.
     *
     * nodes and edges with the show=false will be ignored in this case
     *
     */
    visualizationGraph() {
        let newGraph: Graph;
        if (State.cluster.clusterBy === null) {
            newGraph = State.graph.rawGraph;
        } else {
            newGraph = State.graph.decorateRawGraph(
                this.addInvisibleClusterNode(State.graph.rawGraph)
            );
        }
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

    /**
     * return a new graph that contains the invisible clusters, formed as nodes
     * as well as the edges that connected to the cluster node to simulate the force within the same cluster
     * the new graph is a deep copy of the old node, so no worries of the original graph DS
     *
     * @private
     * @param {Graph} oldGraph
     * @returns {*}  {Graph}
     */
    private addInvisibleClusterNode(oldGraph: Graph): Graph {
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
            State.cluster.getAttributeValues.forEach(
                (attribute: string | number) => {
                    // if a node does not belong to any cluster, a undefined will be formed with no cluster to generate
                    if (attribute === "undefined") return;

                    let clusterID = names[index] + attribute;
                    let visualize: CustomNodeObject = {
                        isClusterNode: true,
                    };
                    graphCopy.addNode(clusterID, { _visualize: visualize });

                    // add edges to simulate the force of the same cluster
                    State.cluster.attributeKeys
                        .get(attribute)
                        ?.forEach((target) => {
                            let visualize: CustomLinkObject = {
                                isClusterLink: true,
                            };
                            graphCopy.addEdge(clusterID, target, {
                                _visualize: visualize,
                            });
                        });
                }
            );
        }

        return graphCopy;
    }

    /**
     * determine whether this Node is the cluster delegate node
     *
     * @param {CustomNodeObject} nodeObject
     */
    nodeVisibility = (nodeObject: CustomNodeObject) => {
        return !nodeObject.isClusterNode;
    };

    /**
     * determine whether this edge is the cluster delegate edge
     *
     * @param {CustomLinkObject} nodeObject
     */
    linkVisibility = (nodeObject: CustomLinkObject) => {
        return !nodeObject.isClusterLink;
    };

    /**
     * all the clusters will form a 3D object to be imported into Scene
     * and this indicates the formed 3d object in the last refresh
     *
     * @type {THREE.Object3D}
     */
    lastObject3D!: THREE.Object3D;

    /**
     * add the computed clusters 3d object to the Scene
     * always keep the Scene with only 1 cluster object by first deleting the last one then add
     *
     */
    clusterDelegation() {
        if (State.cluster.clusterBy === null) {
            return;
        }
        this.threeScene.remove(this.lastObject3D);
        this.lastObject3D = new THREE.Object3D();
        this.convexHullObjects.forEach((value, key) => {
            this.lastObject3D.add(value);
        });
        this.threeScene.add(this.lastObject3D);
    }

    /**
     * the map between the value of the cluster and the 3d object that this cluster created
     *
     * @readonly
     * @type {(Map<string | number, THREE.Object3D>)}
     */
    get convexHullObjects(): Map<string | number, THREE.Object3D> {
        let newMap = new Map<string | number, THREE.Object3D>();
        State.cluster.attributePoints.forEach((value, key) => {
            if (value.length < 4) {
                newMap.set(key, new THREE.Object3D());
            } else {
                let convexHull = new ConvexGeometry(Array.from(value));
                newMap.set(key, GraphDelegate.createMesh(convexHull, key));
            }
        });
        return newMap;
    }

    private static createMesh(
        geom: ConvexGeometry,
        name: string | number
    ): THREE.Object3D {
        // 实例化一个绿色的半透明的材质
        const meshMaterial = new THREE.MeshBasicMaterial({
            color: State.cluster.attributeColor.get(name),
            transparent: true,
            opacity: 0.2,
        });
        meshMaterial.side = THREE.DoubleSide; //将材质设置成正面反面都可见
        const wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true; //把材质渲染成线框

        // 将两种材质都赋给几何体
        return SceneUtils.createMultiMaterialObject(geom, [
            meshMaterial,
            wireFrameMat,
        ]);
    }

    ////

    /**
     * this will re-position the camera to focus on the specified node
     * if distance not specified, a default of 40 will be used
     *
     * @param {string} nodeId the node to be focused
     * @param {number} [distance=40] the ending distance between the camera and the node
     * @returns {*}
     */
    cameraFocusOn(nodeId: string, distance: number = 40) {
        let node = State.graph.rawGraph.getNodeAttribute(nodeId, "_visualize");
        if (!(node.x && node.y && node.z)) return;
        // Aim at node from outside it
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

    /**
     * which link to be highlighted
     *
     * @type {(LinkObject | null)}
     */
    highlightLink: LinkObject | null = null;

    ifHighlightLink<T>(link: LinkObject, _if: T, _else: T, _default: T): T {
        if (State.graphDelegate.highlightLink == null) {
            return _default;
        }
        let sourceId = (link.source as NodeObject).id as string;
        let targetId = (link.target as NodeObject).id as string;

        if (
            (sourceId ===
                (State.graphDelegate.highlightLink?.source as string) &&
                targetId ===
                    (State.graphDelegate.highlightLink?.target as string)) ||
            (sourceId ===
                (State.graphDelegate.highlightLink?.target as string) &&
                targetId ===
                    (State.graphDelegate.highlightLink?.source as string))
        ) {
            return _if;
        } else {
            return _else;
        }
    }
}
