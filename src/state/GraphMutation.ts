import { Attributes, EdgeKey, NodeKey } from "graphology-types";
import { makeAutoObservable } from "mobx";
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

    private that!: GraphStore;

    public addNode(node: NodeKey, attributes?: Attributes): void {
        this.that.rawGraph.addNode(node, attributes);
        this.that.refreshGraph();
    }

    public dropNode(nodeId: string): void {
        this.that.rawGraph.dropNode(nodeId);
        this.that.refreshGraph();
    }

    public addEdge(
        source: NodeKey,
        target: NodeKey,
        attributes?: Attributes
    ): void {
        this.that.rawGraph.addEdge(source, target, attributes);
        this.that.refreshGraph();
    }

    public dropEdge(edge: EdgeKey): void {
        this.that.rawGraph.dropEdge(edge);
        this.that.refreshGraph();
    }

    public dropedge(source: string, target: string): void {
        if (source != null && target != null){
            this.that.rawGraph.dropEdge(source,target);
            this.that.refreshGraph();
        }
    }
}
