import { Toaster, Position, Intent } from "@blueprintjs/core";
import { observable, makeObservable } from "mobx";
import createGraph from "ngraph.graph";
import parse from "csv-parse/lib/sync";

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
            canImport: false,
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
            canImport: false,

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

    async readCSV(fileObject, hasHeader, delimiter) {
        const file = fileObject;
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const content = reader.result;
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

    readEdgeCSV() {
        return this.readCSV(
            this.selectedEdgeFileFromInput,
            this.importConfig.edgeFile.hasHeader,
            this.importConfig.edgeFile.delimiter
        );
    }

    readNodeCSV() {
        return this.readCSV(
            this.selectedNodeFileFromInput,
            this.importConfig.nodeFile.hasHeader,
            this.importConfig.nodeFile.delimiter
        );
    }

    async importGraphFromCSV() {
        const config = this.importConfig;

        // the CSV lib we use uses int index when there's not header/column names specified
        const fromId = config.edgeFile.hasHeader
            ? config.edgeFile.mapping.fromId
            : parseInt(config.edgeFile.mapping.fromId);
        const toId = config.edgeFile.hasHeader
            ? config.edgeFile.mapping.toId
            : parseInt(config.edgeFile.mapping.toId);

        let nodesArr = [];
        let edgesArr = [];
        const graph = createGraph();

        // parse Node file and store into the Graph DS
        if (config.hasNodeFile) {
            nodesArr = await this.readNodeCSV();
            nodesArr.forEach((node) => {
                graph.addNode(node[config.nodeFile.mapping.id].toString(), {
                    _cluster: node[config.nodeFile.mapping.cluster].toString(),
                    id: node[config.nodes.mapping.id].toString(),
                    ...node,
                });
            });
        }

        // parse Edge file and store into the Graph DS
        const edges = await this.readEdgeCSV();
        edges.forEach((it) => {
            const from = it[fromId].toString();
            const to = it[toId].toString();
            if (!graph.hasNode(from)) {
                nodesArr.push({ id: from });
                graph.addNode(from, { id: from });
            }
            if (!graph.hasNode(to)) {
                nodesArr.push({ id: to });
                graph.addNode(to, { id: to });
            }
            graph.addLink(from, to);
            edgesArr.push({
                source_id: from,
                target_id: to,
            });
        });

        config.edgeFile.canImport = true;

        return {
            graph: graph,
            rawGraph: { nodes: nodesArr, edges: edgesArr },
            metadata: {
                snapshotName: "Untitled",
                fullNodes: nodesArr.length,
                fullEdges: edgesArr.length,
                nodeProperties: Object.keys(nodesArr[0]),
                clusterProperties: config.hasNodeFile
                    ? null
                    : config.nodeFile.mapping.cluster,
                edgeProperties: ["source_id", "target_id"],
            },
        };
    }
}
