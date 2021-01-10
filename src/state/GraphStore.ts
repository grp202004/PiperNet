import { observable, computed, makeObservable } from "mobx";
import { Graph } from "ngraph.graph";
import createGraph from "ngraph.graph";

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

export default class GraphStore {
    initialGlobalConfig = {
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

    originalGraph: Graph = createGraph();

    get adapterGraph() {
        interface Node {
            id: string | number;
            name: string | number;
            val: number;
        }

        interface Edge {
            source?: string | number;
            target?: string | number;
        }

        let nodes: Node[] = [];
        let links: Edge[] = [];

        let tempGraph = {
            nodes: nodes,
            links: links,
        };

        // this time the graph has not been imported yet
        if (this.originalGraph == null) {
            return tempGraph;
        }

        this.originalGraph.forEachNode((node) => {
            let thisNode: Node = {
                id: node.id,
                name: node.id,
                val: 1,
            };
            tempGraph.nodes.push(thisNode);
        });

        this.originalGraph.forEachLink((link) => {
            tempGraph.links.push({
                source: link.fromId,
                target: link.toId,
            });
        });
        return tempGraph;
    }

    nodes = this.initialGlobalConfig.nodes;
    edges = this.initialGlobalConfig.edges;

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

    rawGraph = {
        nodes: [],
        edges: [],
    };

    get hasGraph() {
        return (
            this.rawGraph.edges.length != 0 && this.rawGraph.nodes.length != 0
        );
    }

    metadata = {
        snapshotName: String,
        numNodes: 0,
        numEdges: 0,

        // attributes of nodes in imported csv
        nodeProperties: [],
        edgeProperties: [],
    };

    // // Triggers autorun in stores/index.js to sent computedGraph to graph-frontend.
    // get computedGraph() {
    //     const graph = createGraph();
    //     this.rawGraph.nodes.forEach((n) => {
    //         // If isHidden flag is defined and true, ignore the node in graph-frontend.
    //         if (n.isHidden) {
    //             return;
    //         }
    //         const override = this.overrides.get(n.id.toString());
    //         graph.addNode(n.id.toString(), {
    //             label:
    //                 (override && override.get("label")) ||
    //                 n[this.nodes.labelBy],
    //             size:
    //                 (override && override.get("size")) ||
    //                 this.nodeSizeScale(n[this.nodes.sizeBy]),
    //             color:
    //                 (override && override.get("color")) ||
    //                 this.nodeColorScale(n[this.nodes.colorBy]),
    //             shape:
    //                 (override && override.get("shape")) || n[this.nodes.shape],
    //             ref: n,
    //         });
    //     });

    //     this.rawGraph.edges.forEach((e) => {
    //         // If isHidden flag is defined and true on an associated node,
    //         // leave out its related edges.
    //         if (
    //             graph.hasNode(e.source_id.toString()) &&
    //             graph.hasNode(e.target_id.toString())
    //         ) {
    //             graph.addLink(e.source_id.toString(), e.target_id.toString());
    //         }
    //     });

    //     return graph;
    // }

    constructor() {
        makeObservable(this, {
            originalGraph: observable,
            adapterGraph: computed,
            initialGlobalConfig: observable,
            hasGraph: computed,
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
            rawGraph: observable,
            metadata: observable,
            // _lastSelectedSingleNode: observable,
        });
    }
}
