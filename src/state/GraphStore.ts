import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import { Attributes } from "graphology-types";
import {
    createCustomNodeObject,
    createCustomLinkObject,
} from "./GraphDelegate";
import ComponentRef from "../components/ComponentRef";
import State from ".";
import GraphMutation from "./GraphMutation";

/**
 * @description the metadata that importDialog should update to this
 * @author Zichen XU
 * @export
 * @interface IMetaData
 */
export interface IMetaData {
    snapshotName: string;

    // attributes of nodes in imported graph
    nodeProperties: string[];
}

/**
 * @description define a class for storing the raw graph (graphology object),
 * the related metadata information, the public api for setting, refreshing
 * and decorating(change the barebone graph into the appropriate instances that we use to send to 3d-graph renderer)
 * the graph as well as the entry of GraphMutation for manipulating the graph.
 * @author Zichen XU
 * @export
 * @class GraphStore
 */
export default class GraphStore {
    constructor() {
        makeAutoObservable(this);
        this.mutating = new GraphMutation(this);
    }

    /**
     * @description the graphology data structure to store a graph.
     * has a lot of APIs to manipulate as well as iterate through the graph
     * @author Zichen XU
     * @type {Graph}
     */
    rawGraph: Graph = new Graph({
        allowSelfLoops: true,
        multi: false,
        type: "undirected",
    });

    /**
     * @description should be called when individual nodes are added to the graph.
     * add the CustomNodeObject to node attributes stored in the data structure
     * @author Zichen XU
     * @see CustomNodeObject
     * @param {string} node
     * @param {Attributes} attributes
     */
    decorateRawNode(node: string, attributes: Attributes) {
        attributes._visualize = createCustomNodeObject(node, false);
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
        attributes._visualize = createCustomLinkObject(source, target, false);
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
     * @param {Graph} _rawGraph
     * @param {IMetaData} _metadata
     */
    public setGraph(_rawGraph: Graph, _metadata: IMetaData | null = null) {
        this.rawGraph = this.decorateRawGraph(_rawGraph);
        if (_metadata) {
            this.metadata = _metadata;
        }
        State.interaction.flush();
        State.cluster.clusterBy = null;
        State.graphDelegate.clusterObject.initEmptyMapAndFusion();
        ComponentRef.visualizer.updateVisualizationGraph();
    }

    /**
     * @description should be called when the graph gets updated
     * (the data inside the graph gets updated, or the attribute to be clustered has changed)
     * @author Zichen XU
     */
    public refreshGraph() {
        State.interaction.flush();
        ComponentRef.visualizer.updateVisualizationGraph();
    }

    /**
     * @description the wrapper methods to mutate the graph
     * all the mutations of the graph should go through this API rather than calling this.rawGraph.[mutate]
     * has basic functions like addNode, dropNode, addEdge, dropEdge...
     * @author Zichen XU
     * @see {GraphMutation}
     * @type {GraphMutation}
     */
    mutating: GraphMutation;

    /**
     * @description the metadata related to the raw graph
     * should be updated if a new graph is imported
     * @author Zichen XU
     * @type {IMetaData}
     */
    metadata: IMetaData = {
        snapshotName: "SNAPSHOT",
        nodeProperties: [],
    };
}
