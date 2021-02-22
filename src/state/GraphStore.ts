import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import { Attributes } from "graphology-types";
import State from ".";

export interface IMetaData {
    snapshotName: string;

    // attributes of nodes in imported graph
    nodeProperties: string[];
}

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
        attributes._visualize = {
            id: node,
            val: 1, // to be changed, to represent the size of the node
            isClusterNode: false, // if is clusterNode, then the front-end will ignore this node
        };
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
        attributes._visualize = {
            source: source,
            target: target,
            isClusterLink: false, // if is clusterLink, then the front-end will ignore this link
        };
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
     * proxy method to set the new graph
     * if intend to set a new graph, please use this method instead of directly modify GraphStore
     *
     * @param {Graph} newGraph
     * @param {IMetaData} metadata
     */
    public setGraph(newGraph: Graph, metadata: IMetaData) {
        this.rawGraph = this.decorateRawGraph(newGraph);
        this.metadata = metadata;
        this.flush();
        State.cluster.clusterBy = null;
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
    selectedNode: string | null = null;

    /**
     * the currently hovered node id
     * the multiNodeDetailPanel will render and refresh if this changes
     *
     * @type {string}
     */
    currentlyHoveredId: string | null = null;

    /**
     * should call this on every refresh of graph DS
     *
     */
    flush() {
        this.selectedNodes = [];
        this.selectedNode = null;
        this.currentlyHoveredId = null;
    }

    /**
     * if currently there is a graph in the dataset
     *
     * @readonly
     */
    get hasGraph() {
        return this.rawGraph.order && this.rawGraph.size !== 0;
    }

    /**
     * the metadata related to the raw graph
     * should be updated if a new graph is imported
     *
     */
    metadata: IMetaData = {
        snapshotName: "SNAPSHOT",
        nodeProperties: [],
    };
}
