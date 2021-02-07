import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import { CustomNodeObject, CustomLinkObject } from "./GraphDelegate";
import { Attributes } from "graphology-types";

/**
 * the class to store a raw graph as well as the related information
 
 * @export
 * @class GraphStore
 */
export default class GraphStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * the graphology data structure to store a graph.
     * has a lot of APIs to manipulate as well as iterate through the graph
     *
     * @see graphology
     *
     * @type {Graph}
     */
    rawGraph: Graph = new Graph({
        allowSelfLoops: true,
        multi: false,
        type: "undirected",
    });

    /**
     * should be called when individual nodes are added to the graph.

     * add the CustomNodeObject to node attributes stored in the data structure
     * @see CustomNodeObject
     * name as @code _visualize in attributes
     *
     * @param {string} node
     * @param {Attributes} attributes
     */
    decorateRawNode(node: string, attributes: Attributes) {
        let visualize: CustomNodeObject = {
            id: node,
            val: 1, // to be changed, to represent the size of the node
            isClusterNode: false, // if is clusterNode, then the front-end will ignore this node
        };
        attributes._visualize = visualize;
    }

    /**
     * should be called when individual edges are added to the graph.
     *
     * add the CustomLinkObject to node attributes stored in the data structure
     * @see CustomLinkObject
     * name as @code _visualize in attributes
     *
     * @param {string} source
     * @param {string} target
     * @param {Attributes} attributes
     */
    decorateRawEdge(source: string, target: string, attributes: Attributes) {
        let visualize: CustomLinkObject = {
            source: source,
            target: target,
            isClusterLink: false, // if is clusterLink, then the front-end will ignore this link
        };
        attributes._visualize = visualize;
    }

    /**
     * should be called on every graph import
     * add the the _visualize to every links inside the specified graph
     *
     * the _visualize is for storing the object to be send to front-end to render the graph
     *
     * @param {Graph} _rawGraph
     * @return {*}  {Graph}
     */
    decorateRawGraph(_rawGraph: Graph): Graph {
        _rawGraph.forEachNode((node, attributes) =>
            this.decorateRawNode(node, attributes)
        );

        _rawGraph.forEachEdge((edge, attributes, source, target) =>
            this.decorateRawEdge(source, target, attributes)
        );
        return _rawGraph;
    }

    /**
     * the currently selected node ids
     * the singleNodeDetailPanel will render and refresh if this changes
     *
     * @type {string[]}
     */
    selectedNodes: string[] = [];

    /**
     * the currently selected node id
     *
     * @type {string}
     */
    selectedNode: string = "";

    /**
     * the currently hovered node id
     * the multiNodeDetailPanel will render and refresh if this changes
     *
     * @type {string}
     */
    currentlyHoveredId: string = "undefined";

    /**
     * if currently there is a graph in the dataset
     *
     * @readonly
     */
    get hasGraph() {
        return this.rawGraph.order && this.rawGraph.size != 0;
    }

    /**
     * the metadata related to the raw graph
     * should be updated if a new graph is imported
     *
     */
    metadata = {
        snapshotName: String,

        // attributes of nodes in imported graph
        nodeProperties: [] as string[],
    };
}
