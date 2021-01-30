import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import * as graphology from "graphology-types";
import {
    ForceGraphMethods,
    NodeObject,
    LinkObject,
} from "react-force-graph-3d";
import { CustomNodeObject } from "./GraphDelegate";
import FileSaver from 'file-saver';

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
        multi: false,
        type: "undirected",
    });

    decorateRawGraph(_rawGraph: Graph) {
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
            };
            _rawGraph.setNodeAttribute(node, "_visualize", visualize);
        });
        this.rawGraph = _rawGraph;
    }

    get delegateGraph() {
        let tempGraph = {
            nodes: [] as CustomNodeObject[],
            links: [] as LinkObject[],
        };
        this.rawGraph.forEachNode((node, attributes) => {
            tempGraph.nodes.push(attributes["_visualize"]);
        });

        tempGraph.links = this.rawGraph.export().edges;
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

    // public exportNodeFile(_tempGraph: Graph) {
    //     let nodeList: any[] = _tempGraph.export().nodes;
    //     let attributesList: string[] = Object.keys(nodeList[0]);
    //     let str = '';
    //     let i: number;
    //     let j: number;

    //     for(const i in attributesList) {
    //         if (str === ''){
    //             str = str + i;
    //         } else {
    //         str = str  + ',' + i;
    //         }
    //     }

    //     for (i = 0;i<_tempGraph.order;i++){
    //         str = str + '\n' + nodeList[i].key;
    //         for(j = 0;j<attributesList.length;j++){
    //             str = str + ',' + _tempGraph.getNodeAttribute(nodeList[i].key,attributesList[j]);
    //         }
    //     }

    //     let blob = new Blob([str], {type: "text/plain;charset=utf-8"});
    //     FileSaver.saveAs(blob, "nodefile.csv");
    // }

    // public exportEdgeFile(_tempGraph: Graph) {
    //     let edgeList: any[] = _tempGraph.export().edges;
    //     let attributeList: string[] = Object.keys(edgeList[0]);
    //     let str = '';
    //     let i: number;
    //     let j: number;

    //     for(const i in attributeList) {
    //         if (str === ''){
    //             str = str + i;
    //         } else {
    //         str = str  + ',' + i;
    //         }
    //     }

    //     for (i = 0;i<_tempGraph.size;i++){
    //         str = str + '\n' + edgeList[i].key + ',' + edgeList[i].source + ',' + edgeList[i].target;
    //         for(j = 0;j<attributeList.length;j++){
    //             str = str + ',' + _tempGraph.getEdgeAttribute(edgeList[i].source,edgeList[i].target,attributeList[j]);
    //         }
    //     }

    //     let blob = new Blob([str], {type: "text/plain;charset=utf-8"});
    //     FileSaver.saveAs(blob, "edgefile.csv");

    // }

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
}
