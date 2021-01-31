import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import {
    CustomNodeObject,
    CustomLinkObject,
} from "../components/visualize/GraphDelegate";

/**
 * the hidden options inside a node
 * will be mounted as a attribute named as [_options] inside every node
 *
 * @export
 * @interface IHiddenOptions
 */
export interface IHiddenOptions {
    show: boolean;
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
     * @memberof GraphStore
     */
    rawGraph: Graph = new Graph({
        allowSelfLoops: true,
        multi: false,
        type: "undirected",
    });

    /**
     * should be called on every graph import
     * add the _options and _visualize to every nodes inside the specified graph
     * as well as the _visualize to every links inside the specified graph
     *
     * the _options is for the visualizing configs: such as the show or hide of a node
     * the _visualize is for storing the object to be send to front-end to render the graph
     *
     * @param {Graph} _rawGraph
     * @return {*}  {Graph}
     * @memberof GraphStore
     */
    decorateRawGraph(_rawGraph: Graph): Graph {
        _rawGraph.forEachNode((node, attributes) => {
            // add _options and _visualize to attributes
            let options: IHiddenOptions = {
                show: true,
            };
            attributes._options = options;

            let visualize: CustomNodeObject = {
                id: node,
                name: node,
                val: 1, // to be changed, to represent the size of the node
                isClusterNode: false, // if is clusterNode, then the front-end will ignore this node
            };
            attributes._visualize = visualize;
        });

        _rawGraph.forEachEdge((edge, attributes, source, target) => {
            let visualize: CustomLinkObject = {
                source: source,
                target: target,
                isClusterLink: false, // if is clusterLink, then the front-end will ignore this link
            };
            attributes._visualize = visualize;
        });
        return _rawGraph;
    }

    /**
     * hide the node specified by node id
     *
     * @param {string} key
     * @memberof GraphStore
     */
    public hideNode(key: string) {
        let originalOptions: IHiddenOptions = this.rawGraph.getNodeAttribute(
            key,
            "_options"
        );
        let newOptions: IHiddenOptions = {
            ...originalOptions,
            show: false,
        };
        this.rawGraph.setNodeAttribute(key, "_options", newOptions);
    }

    /**
     * hide the node specified by node id
     *
     * @param {string} key
     * @memberof GraphStore
     */
    public showNode(key: string) {
        let originalOptions: IHiddenOptions = this.rawGraph.getNodeAttribute(
            key,
            "_options"
        );
        let newOptions: IHiddenOptions = {
            ...originalOptions,
            show: true,
        };
        this.rawGraph.setNodeAttribute(key, "_options", newOptions);
    }

    /**
     * the currently selected node ids
     * the singleNodeDetailPanel will render and refresh if this changes
     *
     * @type {string[]}
     * @memberof GraphStore
     */
    selectedNodes: string[] = [];

    /**
     * the currently hovered node id
     * the multiNodeDetailPanel will render and refresh if this changes
     *
     * @memberof GraphStore
     */

    currentlyHoveredId: string = "undefined";

    /**
     * if currently there is a graph in the dataset
     *
     * @readonly
     * @memberof GraphStore
     */
    get hasGraph() {
        return this.rawGraph.order && this.rawGraph.size != 0;
    }

    /**
     * the metadata related to the raw graph
     * should be updated if a new graph is imported
     *
     * @memberof GraphStore
     */
    metadata = {
        snapshotName: String,

        // attributes of nodes in imported csv
        nodeProperties: [],
        edgeProperties: [],
    };
}
