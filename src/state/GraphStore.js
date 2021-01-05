import { observable, computed, action, runInAction } from "mobx";

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

    metadata = {
        numNodes: 0,
        numEdges: 0,

        // attributes of nodes in imported csv
        nodeProperties: [],
        edgeProperties: [],
    };
}
