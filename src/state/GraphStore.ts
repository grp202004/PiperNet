import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import { Attributes, NodeKey, NodeEntry, EdgeKey } from "graphology-types";
import ComponentRef from "../components/ComponentRef";
import State from ".";
import GraphMutation from "./GraphMutation";
import { NodeObject } from "_react-force-graph-3d@1.18.8@react-force-graph-3d";

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
        this.mutating = new GraphMutation(this);
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
            nodeColor: this.defaultStyle.node.color, // color test
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
            edgeColor: this.defaultStyle.edge.color, //color test
            edgeWidth: this.defaultStyle.edge.width,
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
    public setGraph(_rawGraph: Graph, _metadata: IMetaData | null = null) {
        this.rawGraph = this.decorateRawGraph(_rawGraph);
        if (_metadata) {
            this.metadata = _metadata;
        }
        this.flush();
        State.cluster.clusterBy = null;
        ComponentRef.visualizer.updateVisualizationGraph();
    }

    /**
     * should be called when the graph gets updated (the data inside the graph gets updated, or the attribute to be clustered has changed)
     *
     * @memberof GraphStore
     */
    public refreshGraph() {
        this.flush();
        ComponentRef.visualizer.updateVisualizationGraph();
    }

    /**
     * the wrapper methods to mutate the graph
     * all the mutations of the graph should go through this API rather than calling this.rawGraph.[mutate]
     *
     * has basic functions like addNode, dropNode, addEdge, dropEdge...
     *
     * @see {GraphMutation}
     */
    mutating: GraphMutation;

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
    previouslyHoverdId: string | null = null;
    currentlyHoveredNeighbors: string[] | null = null;
    previouslyHoveredNeighbors: string[] | null = null;
    edgesOfCurrentlyHoveredNode: EdgeKey[] = [];
    edgesOfPreviouslyHoveredNode: EdgeKey[] = [];
    defaultStyle: Attributes = {
        node: {
            color: "orangered",
        },
        edge: {
            color: "#ff11ff",
            width: 1,
        },
    };
    ishovered: boolean = false;

    getNodeId(node: NodeObject): string {
        let nodeId: string;
        if (node.id as string) {
            nodeId = node.id as string;
        } else {
            nodeId = (node.id as number).toString();
        }
        return nodeId;
    }

    setNodeColor(node: NodeKey, color: string) {
        const visualize = this.rawGraph.getNodeAttribute(node, "_visualize");
        // console.log(visualize); //test
        visualize.nodeColor = color;
        // console.log(visualize); //test
        this.rawGraph.setNodeAttribute(node, "_visualize", visualize);
        // State.graph.rawGraph.updateNodeAttribute(node,"_visualize",());
    }

    getNeighbors(node: NodeKey): string[] {
        if (node === "") {
            return [];
        }
        let neighbors: string[] = [];
        this.rawGraph.forEachNeighbor(node, (neighbor) => {
            neighbors.push(neighbor);
        });
        return neighbors;
    }

    getEdgesOfNode(node: NodeKey): EdgeKey[] {
        let edges: EdgeKey[] = [];
        let nodeNeighbors: string[] = this.getNeighbors(node);
        if (nodeNeighbors.length === 0) {
            return [];
        }
        nodeNeighbors.forEach((neighborNode) => {
            if (
                typeof this.rawGraph.edge(
                    this.currentlyHoveredId as NodeKey,
                    neighborNode as NodeKey
                ) === "undefined"
            ) {
                edges.push(
                    this.rawGraph.edge(
                        neighborNode as NodeKey,
                        this.currentlyHoveredId as NodeKey
                    ) as string
                );
            } else {
                edges.push(
                    this.rawGraph.edge(
                        this.currentlyHoveredId as NodeKey,
                        neighborNode as NodeKey
                    ) as string
                );
            }
        });

        return edges;
    }

    setNeighborColor(node: NodeKey, color: string) {
        let nodeNeighbors: string[] = this.getNeighbors(node);
        if (nodeNeighbors !== null && nodeNeighbors.length !== 0) {
            nodeNeighbors.forEach((neighborNode) => {
                this.setNodeColor(neighborNode, color);
            });
        }
    }

    setNodesColor(nodes: NodeKey[], color: string) {
        if (nodes.length !== 0) {
            nodes.forEach((node) => {
                this.setNodeColor(node, color);
            });
        }
    }

    setEdgeColor(edge: EdgeKey, color: string) {
        const visualize = this.rawGraph.getEdgeAttribute(edge, "_visualize");
        // console.log(visualize); //test
        visualize.edgeColor = color;
        // console.log(visualize); //test
        this.rawGraph.setEdgeAttribute(edge, "_visualize", visualize);
    }

    setEdgesColor(edges: EdgeKey[], color: string) {
        if (edges.length !== 0) {
            edges.forEach((edge) => {
                this.setEdgeColor(edge, color);
            });
        }
    }

    setEdgeWidth(edge: EdgeKey, width: number) {
        const visualize = this.rawGraph.getEdgeAttribute(edge, "_visualize");
        // console.log(visualize); //test
        visualize.edgeWidth = width;
        // console.log(visualize); //test
        this.rawGraph.setEdgeAttribute(edge, "_visualize", visualize);
    }

    setEdgesWidth(edges: EdgeKey[], width: number) {
        if (edges.length !== 0) {
            edges.forEach((edge) => this.setEdgeWidth(edge, width));
        }
    }
    notHovered() {
        if (this.previouslyHoverdId !== null) {
            this.setNodeColor(
                this.previouslyHoverdId,
                this.defaultStyle.node.color
            );
        }
        if (this.previouslyHoveredNeighbors !== null) {
            this.setNodesColor(
                this.previouslyHoveredNeighbors,
                this.defaultStyle.node.color
            );
        }
        if (this.edgesOfPreviouslyHoveredNode.length !== 0) {
            this.setEdgesColor(
                this.edgesOfPreviouslyHoveredNode,
                this.defaultStyle.edge.color
            );
            this.setEdgesWidth(
                this.edgesOfPreviouslyHoveredNode,
                this.defaultStyle.edge.width
            );
        }
        this.ishovered = false;
    }

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
