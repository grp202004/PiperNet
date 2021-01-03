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

    @observable nodes = this.initialGlobalConfig.nodes;
    @observable edges = this.initialGlobalConfig.edges;

    @observable enableDegree = true;
    @observable enableDensity = true;
    @observable enableDiameter = false;
    @observable enableCoefficient = true;
    @observable enableComponent = true;

    // Updated by frame event
    @observable selectedNodes = [];

    // Currently hovered node
    @observable currentlyHovered = undefined;

    // Cache the single node that's been selected last time
    // and will not update unless exactly one node is selected again
    // useful for NeighborDialog
    _lastSelectedSingleNode = null;

    @observable
    rawGraph = {
        nodes: [],
        edges: [],
    };

    @observable
    metadata = {
        numNodes: 0,
        numEdges: 0,

        // attributes of nodes in imported csv
        nodeProperties: [],
        edgeProperties: [],
    };
}
