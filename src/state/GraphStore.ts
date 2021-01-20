import { observable, computed, makeObservable } from "mobx";
import Graph from "graphology";
import * as graphology from "graphology-types";
import State from ".";

// interface Edge<Data = any> {
//     id: LinkId,
//     fromId: NodeId,
//     toId: NodeId,
//     data: Data
// }

// interface Node<Data = any> {
//     id: NodeId,
//     links: Link[],
//     data: Data
// }

export interface IHiddenOptions {
    show: boolean;
    isClusterNode: boolean;
}

interface GraphNode {
    id: string | number;
    name: string | number;
    val: number;
}

interface GraphEdge {
    source?: string | number;
    target?: string | number;
}

export default class GraphStore {
    globalConfig = {
        nodes: {
            colorBy: "pagerank",
            color: {
                scale: "Linear Scale",
                from: "#448AFF",
                to: "#E91E63",
            },
            sizeBy: "pagerank",
            size: {
                min: 2,
                max: 10,
                scale: "Linear Scale",
            },
            labelBy: "node_id",
            shape: "circle",
            labelSize: 1,
            labelLength: 10,
        },
        edges: {
            color: "#7f7f7f",
        },
    };

    rawGraph: Graph = new Graph({
        allowSelfLoops: true,
        multi: false,
        type: "undirected",
    });

    get clusterDelegateNode(): GraphNode[] {
        let clusters = State.cluster.getAttributeValues;
        let nodes: GraphNode[] = [];

        clusters.forEach((cluster) => {
            nodes.push({
                id: "_CLUSTER" + cluster,
                name: "_CLUSTER" + cluster,

                // need be changed next
                val: 100,
            });
        });

        return nodes;
    }

    get adapterGraph() {
        //interface from react-force-graph

        let nodes: GraphNode[] = [];
        let links: GraphEdge[] = [];

        let tempGraph = {
            nodes: nodes,
            links: links,
        };

        let exportedGraph = this.rawGraph.export();
        exportedGraph.nodes.forEach((node: graphology.SerializedNode) => {
            if (!node.attributes?._options.show) return;
            let thisNode: GraphNode = {
                id: node.key,
                name: node.key,

                // need be changed next
                val: 1,
            };
            tempGraph.nodes.push(thisNode);
        });

        tempGraph.nodes.concat(this.clusterDelegateNode);

        tempGraph.links = exportedGraph.edges;
        return tempGraph;
    }

    get rawTable(): graphology.SerializedNode[] {
        return this.rawGraph.export().nodes;
    }

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

    nodes = this.globalConfig.nodes;
    edges = this.globalConfig.edges;

    enableDegree = true;
    enableDensity = true;
    enableDiameter = false;
    enableCoefficient = true;
    enableComponent = true;

    // Updated by frame event
    selectedNodes = [];

    // Currently hovered node
    currentlyHovered = undefined;

    // Cache the single node that's been selected last time
    // and will not update unless exactly one node is selected again
    // useful for NeighborDialog
    _lastSelectedSingleNode = null;

    get hasGraph() {
        return this.rawGraph.order && this.rawGraph.size != 0;
    }

    metadata = {
        snapshotName: String,
        numNodes: 0,
        numEdges: 0,

        // attributes of nodes in imported csv
        nodeProperties: [],
        edgeProperties: [],
    };

    constructor() {
        makeObservable(this, {
            rawGraph: observable,
            adapterGraph: computed,
            rawTable: computed,
            globalConfig: observable,
            hasGraph: computed,
            clusterDelegateNode: computed,
            nodes: observable,
            edges: observable,
            // computedGraph: computed,
            enableDegree: observable,
            enableDensity: observable,
            enableDiameter: observable,
            enableCoefficient: observable,
            enableComponent: observable,
            selectedNodes: observable,
            currentlyHovered: observable,
            _lastSelectedSingleNode: observable,
            metadata: observable,
            // _lastSelectedSingleNode: observable,
        });
    }
}
