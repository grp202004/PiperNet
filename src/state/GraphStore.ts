import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import * as graphology from "graphology-types";
import uniq from "lodash/uniq";
import {
    ForceGraphMethods,
    NodeObject,
    LinkObject,
} from "react-force-graph-3d";
import {
    CustomNodeObject,
    CustomLinkObject,
} from "../components/visualize/GraphDelegate";

export interface IHiddenOptions {
    show: boolean;
}

export default class GraphStore {
    constructor() {
        makeAutoObservable(this);
    }

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
        multi: true,
        type: "undirected",
    });

    decorateRawGraph(_rawGraph: Graph): Graph {
        _rawGraph.forEachNode((node, attributes) => {
            // add _options and _visualize to attributes
            let options: IHiddenOptions = {
                show: true,
            };
            _rawGraph.setNodeAttribute(node, "_options", options);

            let visualize: CustomNodeObject = {
                id: node,
                name: node,
                val: 1,
                isClusterNode: false,
            };
            attributes._visualize = visualize;
        });

        _rawGraph.forEachEdge((edge, attributes, source, target) => {
            let visualize: CustomLinkObject = {
                source: source,
                target: target,
                isClusterLink: false,
            };
            attributes._visualize = visualize;
        });
        return _rawGraph;
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

    get allPropertiesKeyList() {
        return uniq(this.metadata.nodeProperties.filter((k) => k !== "id")); // since node_id is already present
    }

    nodes = this.globalConfig.nodes;
    edges = this.globalConfig.edges;

    enableDegree = true;
    enableDensity = true;
    enableDiameter = false;
    enableCoefficient = true;
    enableComponent = true;

    // Updated by frame event
    selectedNodes: String[] = ["1", "2"];

    //currently hovered node id
    currentlyHoveredId: string = "undefined";

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
}
