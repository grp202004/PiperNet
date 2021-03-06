import ReactDOM from "react-dom";
import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import State from ".";
import {
    ForceGraphMethods,
    LinkObject,
    NodeObject,
} from "react-force-graph-3d";
import * as THREE from "three";
import Cluster3dObjectStore from "./Cluster3dObjectStore";
import { Object3D } from "three";
import ComponentRef from "../components/ComponentRef";

/**
 * hovered: false, selected: false: DefaultColor;
 * hovered: false, selected: true: SelectedColor;
 * hovered: true, selected: false: HighlightColor;
 * hovered: true, selected: true: HighlightColor;
 *
 *
 * @interface ICustomNodeObject
 * @extends {NodeObject}
 */
export interface ICustomNodeObject extends NodeObject {
    hovered: boolean;
    selected: boolean;
    multiSelected: boolean;
    isClusterNode?: boolean;
}
/**
 * hovered: false, selected: false: DefaultColor;
 * hovered: false, selected: true: SelectedColor;
 * hovered: true, selected: false: HighlightColor;
 * hovered: true, selected: true: HighlightColor;
 *
 *
 * @interface ICustomLinkObject
 * @extends {LinkObject}
 */
export interface ICustomLinkObject extends LinkObject {
    hovered: boolean;
    selected: boolean;
    isClusterLink?: boolean;
}

export function createCustomNodeObject(
    _id: string,
    _cluster: boolean = false
): ICustomNodeObject {
    let result: ICustomNodeObject = {
        id: _id,
        hovered: false,
        selected: false,
        multiSelected: false,
        isClusterNode: _cluster,
    };
    return result;
}

export function createCustomLinkObject(
    _source: string,
    _target: string,
    _cluster: boolean = false
): ICustomLinkObject {
    let result: ICustomLinkObject = {
        source: _source,
        target: _target,
        hovered: false,
        selected: false,
        isClusterLink: _cluster,
    };
    return result;
}

export default class GraphDelegate {
    constructor() {
        makeAutoObservable(this);
        this.clusterObject = new Cluster3dObjectStore();
    }

    /**
     * assign the force-graph methods to this class
     * should be called as long as the visualizer react component is mounted
     *
     * @param {ForceGraphMethods} _graphDelegateMethods
     */
    mountDelegateMethods(_graphDelegateMethods: ForceGraphMethods) {
        this.graphDelegateMethods = _graphDelegateMethods;
        this.clusterObject.threeScene = this.graphDelegateMethods.scene();
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
            newGraph = this.addInvisibleClusterNode(
                State.graph.decorateRawGraph(State.graph.rawGraph)
            );
        }
        let tempGraph = {
            nodes: [] as ICustomLinkObject[],
            links: [] as ICustomLinkObject[],
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
        let graphCopy = oldGraph.copy();
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
                    graphCopy.addNode(clusterID, {
                        _visualize: createCustomNodeObject(clusterID, true),
                    });

                    // add edges to simulate the force of the same cluster
                    State.cluster.attributeKeys
                        .get(attribute)
                        ?.forEach((target) => {
                            graphCopy.addEdgeWithKey(
                                `${clusterID}-${target}`,
                                clusterID,
                                target,
                                {
                                    _visualize: createCustomLinkObject(
                                        clusterID,
                                        target,
                                        true
                                    ),
                                }
                            );
                        });
                }
            );
        }

        return graphCopy;
    }

    onDocumentMouseMove(event: MouseEvent) {
        if (
            State.cluster.clusterBy === null ||
            !State.graphDelegate.graphDelegateMethods
        ) {
            State.interaction.currentlyHoveredClusterId = null;
            return;
        }
        let element = ReactDOM.findDOMNode(ComponentRef.visualizer);
        let box = (<Element>element)?.getBoundingClientRect();

        let vector = new THREE.Vector3(
            ((event.clientX - box.left) / box.width) * 2 - 1,
            -((event.clientY - box.top) / box.height) * 2 + 1,
            0.5
        );

        let camera = State.graphDelegate.graphDelegateMethods?.camera();
        if (!camera) {
            return;
        }
        vector = vector.unproject(camera);

        let raycaster = new THREE.Raycaster(
            camera.position,
            vector.sub(camera.position).normalize()
        );
        let intersects = raycaster.intersectObjects(
            State.graphDelegate.clusterObject.fusionClusterObjects
                ?.children as Object3D[],
            true
        );

        if (intersects.length > 0) {
            console.log("currentlyHoveredNodeId", intersects);
            State.interaction.currentlyHoveredClusterId =
                intersects[0].object.uuid;
        } else {
            State.interaction.currentlyHoveredClusterId = null;
        }
    }

    /**
     * determine whether this Node is the cluster delegate node
     *
     * @param {CustomNodeObject} nodeObject
     */
    nodeVisibility = (nodeObject: NodeObject) => {
        let node = nodeObject as ICustomNodeObject;
        return !node.isClusterNode;
    };

    /**
     * determine whether this edge is the cluster delegate edge
     *
     * @param {CustomLinkObject} nodeObject
     */
    linkVisibility = (linkObject: LinkObject) => {
        let link = linkObject as ICustomLinkObject;
        return !link.isClusterLink;
    };

    ////

    clusterObject: Cluster3dObjectStore;

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

    ////

    /**
     * set the force inside each cluster in the ForceGraph
     *
     * @param {number} force the force to be set
     * @param {number} _default default force of other links
     */
    updateClusterForce() {
        this.graphDelegateMethods
            ?.d3Force("link")
            //@ts-ignore
            ?.distance((link: CustomLinkObject) => {
                return link.isClusterLink
                    ? State.css.cluster.clusterForce
                    : State.css.cluster.normalForce;
            });
        this.graphDelegateMethods.d3ReheatSimulation();
    }
}
