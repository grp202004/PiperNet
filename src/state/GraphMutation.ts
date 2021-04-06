import { Attributes, EdgeKey, NodeKey } from "graphology-types";
import { makeAutoObservable } from "mobx";
import State from ".";
import GraphStore from "./GraphStore";

/**
 * the wrapper mutating function that relates to the mutation of the rawGraph DS
 * all the mutation of the Graph should all go through this API rather than calling on rawGraph directly.
 *
 * @export
 * @class GraphMutation
 */
export default class GraphMutation {
    constructor(_this: GraphStore) {
        makeAutoObservable(this);
        this.that = _this;
    }

    /**
     * @description the graph store
     * @see GraphStore
     * @author Zichen XU
     * @private
     * @type {GraphStore}
     */
    private that!: GraphStore;

    /**
     * @description add the node with this attribute to the Graph and refresh the 3d Graph
     * if not specify attributes._visualize , then will add it into the attributes before adding to Graph
     * @author Zichen XU
     * @param {NodeKey} node
     * @param {Attributes} [attributes]
     */
    public addNode(node: NodeKey, attributes?: Attributes): void {
        let newAttributes: Attributes;
        if (!attributes) {
            newAttributes = {};
            State.graph.decorateRawNode(node as string, newAttributes);
        } else if (!attributes.hasOwnProperty("_visualize")) {
            newAttributes = attributes;
            State.graph.decorateRawNode(node as string, newAttributes);
        } else {
            newAttributes = attributes;
        }
        this.that.rawGraph.addNode(node, newAttributes);
        this.that.refreshGraph();
    }

    /**
     * @description delete the node with this nodeId in the Graph and refresh the 3d Graph
     * @author Zichen XU
     * @param {string} nodeId
     */
    public dropNode(nodeId: string): void {
        this.that.rawGraph.dropNode(nodeId);
        this.that.refreshGraph();
    }

    /**
     * @description add the edge with this attribute to the Graph and refresh the 3d Graph
     * if not specify attributes._visualize , then will add it into the attributes before adding to Graph
     * @author Zichen XU
     * @param {NodeKey} source
     * @param {NodeKey} target
     * @param {Attributes} [attributes]
     */
    public addEdge(
        source: NodeKey,
        target: NodeKey,
        attributes?: Attributes
    ): void {
        let newAttributes: Attributes;
        if (!attributes) {
            newAttributes = {};
            State.graph.decorateRawEdge(
                source as string,
                target as string,
                newAttributes
            );
        } else if (!attributes.hasOwnProperty("_visualize")) {
            newAttributes = attributes;
            State.graph.decorateRawEdge(
                source as string,
                target as string,
                newAttributes
            );
        } else {
            newAttributes = attributes;
        }
        this.that.rawGraph.addEdge(source, target, newAttributes);
        this.that.refreshGraph();
    }

    /**
     * @description delete the edge with this key in the Graph and refresh the 3d Graph
     * @author Zichen XU
     * @param {EdgeKey} edge
     */
    public dropEdge(edge: EdgeKey): void {
        this.that.rawGraph.dropEdge(edge);
        this.that.refreshGraph();
    }
}
