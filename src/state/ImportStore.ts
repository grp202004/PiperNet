import { Toaster, Position, Intent } from "@blueprintjs/core";
import { observable, makeObservable } from "mobx";
import createGraph from "ngraph.graph";
import parse from "csv-parse/lib/sync";
import { IRawGraph, INode, IEdge } from "./GraphStore";

export default class ImportStore {
    // whether the graph is in importing
    isLoading = false;
    //name of the edge file
    edgeFileName = "Choose Edge File ...";

    //name of the node file
    nodeFileName = "Choose Node File ...";

    importCSVDialogOpen = false;
    importGEXFDialogOpen = false;

    // specific: File object selected via the file input.
    selectedEdgeFileFromInput = null;
    selectedNodeFileFromInput = null;

    selectedGEXFFileFromInput = null;

    importConfig = {
        hasNodeFile: false,
        nodeFile: {
            // the file is successfully parsed and ready for display
            isReady: false,
            path: "",

            // has header at the top
            hasHeader: true,

            // Get top 20 lines. Or if there's less than 10 line, get all the lines.
            topN: [],
            //names for the columns of this csv
            columns: [],
            mapping: {
                id: "Unknown",
                cluster: "Unknown",
            },
            delimiter: ",",
        },
        edgeFile: {
            isReady: false,

            // should save the csv to temp for further change the cluster attribute
            path: "",
            hasHeader: true,

            // array of objects storing the
            topN: [],
            columns: [],
            mapping: {
                fromId: "Unknown",
                toId: "Unknown",
            },
            delimiter: ",",
        },
    };

    constructor() {
        makeObservable(this, {
            isLoading: observable,
            edgeFileName: observable,
            nodeFileName: observable,
            importCSVDialogOpen: observable,
            importGEXFDialogOpen: observable,
            selectedEdgeFileFromInput: observable,
            selectedNodeFileFromInput: observable,
            selectedGEXFFileFromInput: observable,
            importConfig: observable,
        });
    }

    private async readCSV(
        fileObject: File,
        hasHeader: boolean,
        delimiter: string
    ): Promise<string[]> {
        const file = fileObject;
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                let content: any = reader.result;
                try {
                    if (hasHeader) {
                        resolve(
                            parse(content, {
                                comment: "#",
                                trim: true,
                                auto_parse: true,
                                skip_empty_lines: true,
                                columns: hasHeader,
                                delimiter,
                            })
                        );
                    }
                    resolve(
                        parse(content, {
                            comment: "#",
                            trim: true,
                            auto_parse: true,
                            skip_empty_lines: true,
                            columns: undefined,
                            delimiter,
                        })
                    );
                } catch (err) {
                    let msg = err.message;
                    let mismatch = msg.indexOf("Invalid Record Length:") == 0;
                    if (mismatch) {
                        msg = msg.replace("is", "set to");
                        msg = msg.replace("got", "but detected");
                    }
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: " + msg,
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                }
            };
        });
    }

    public readEdgeCSV(): Promise<string[]> {
        return this.readCSV(
            this.selectedEdgeFileFromInput,
            this.importConfig.edgeFile.hasHeader,
            this.importConfig.edgeFile.delimiter
        );
    }

    public readNodeCSV(): Promise<string[]> {
        return this.readCSV(
            this.selectedNodeFileFromInput,
            this.importConfig.nodeFile.hasHeader,
            this.importConfig.nodeFile.delimiter
        );
    }

    private createNode(_id: string, _data: any, cluster: string): INode {
        let tempNode: INode;
        tempNode.Id = _id;
        tempNode.data = _data;
        tempNode.data._cluster = cluster;
        return tempNode;
    }

    private createEdge(_fromId: string, _toId: string, _value: any) {
        let tempEdge: IEdge;
        tempEdge.fromId = _fromId;
        tempEdge.toId = _toId;
        tempEdge.value = _value;
        return tempEdge;
    }

    public async importGraphFromCSV() {
        const config = this.importConfig;

        // the CSV lib we use uses int index when there's not header/column names specified
        const fromId = config.edgeFile.hasHeader
            ? config.edgeFile.mapping.fromId
            : parseInt(config.edgeFile.mapping.fromId);
        const toId = config.edgeFile.hasHeader
            ? config.edgeFile.mapping.toId
            : parseInt(config.edgeFile.mapping.toId);

        let rawGraph: IRawGraph;

        let tempNodes = [];
        let tempEdges = [];

        let nodes: INode[];
        let edges: IEdge[];

        const graph = createGraph();

        // parse Node file and store into the Graph DS
        if (config.hasNodeFile) {
            tempNodes = await this.readNodeCSV();
            tempNodes.forEach((node) => {
                let thisNode: INode = this.createNode(
                    node[config.nodeFile.mapping.id].toString(),
                    node[config.nodeFile.mapping.cluster].toString(),
                    node[config.nodeFile.mapping.cluster].toString()
                );
                graph.addNode(thisNode.Id, thisNode.data);
                nodes.push(thisNode);
            });
        }

        // parse Edge file and store into the Graph DS
        tempEdges = await this.readEdgeCSV();
        tempEdges.forEach((edge) => {
            let thisEdge: IEdge = this.createEdge(
                edge[fromId].toString(),
                edge[toId].toString(),
                0
            );
            if (!graph.hasNode(thisEdge.fromId)) {
                let missingNode: INode = this.createNode(
                    thisEdge.fromId,
                    { id: thisEdge.fromId },
                    null
                );
                graph.addNode(missingNode.Id, missingNode.data);
                nodes.push(missingNode);
            }
            if (!graph.hasNode(thisEdge.toId)) {
                let missingNode: INode = this.createNode(
                    thisEdge.toId,
                    { id: thisEdge.toId },
                    null
                );
                graph.addNode(missingNode.Id, missingNode.data);
                nodes.push(missingNode);
            }
            graph.addLink(thisEdge.fromId, thisEdge.toId);
            edges.push(thisEdge);
        });

        config.edgeFile.isReady = true;

        return {
            graph: graph,
            rawGraph: { nodes: nodes, edges: edges },
            metadata: {
                snapshotName: "Untitled",
                fullNodes: nodes.length,
                fullEdges: edges.length,
                nodeProperties: Object.keys(nodes[0]),
                clusterProperties: config.hasNodeFile
                    ? null
                    : config.nodeFile.mapping.cluster,
                edgeProperties: ["source_id", "target_id"],
            },
        };
    }
}
