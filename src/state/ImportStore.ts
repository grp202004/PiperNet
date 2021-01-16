import { Toaster, Position, Intent } from "@blueprintjs/core";
import { observable, makeObservable, trace } from "mobx";
import Graph from "graphology";
import * as graphology from "graphology-types";
import gexf from "graphology-gexf";
import parse from "csv-parse/lib/sync";
import { IHiddenOptions } from "./GraphStore";

export default class ImportStore {
    // whether the graph is in importing
    isLoading = false;
    //name of the edge file
    edgeFileName = "Choose Edge File ...";

    //name of the node file
    nodeFileName = "Choose Node File ...";

    //name of the GEXF file
    gexfFileName = "Choose GEXF File ...";

    importCSVDialogOpen = false;
    importGEXFDialogOpen = false;

    // specific: File object selected via the file input.
    selectedEdgeFileFromInput!: File;
    selectedNodeFileFromInput!: File;

    selectedGEXFFileFromInput!: File;

    importConfig = {
        hasNodeFile: false,
        nodeFile: {
            // the file is successfully parsed and ready for display
            isReady: false,
            parseError: false,
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
            parseError: false,

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
            gexfFileName: observable,
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
    ): Promise<any[]> {
        const file = fileObject;
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                let content: any = reader.result;
                content = content.replace(/\r\n/g, "\n");
                content = content.replace(/\r/g, "\n");
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

    public readEdgeCSV(): Promise<any[]> {
        return this.readCSV(
            this.selectedEdgeFileFromInput,
            this.importConfig.edgeFile.hasHeader,
            this.importConfig.edgeFile.delimiter
        );
    }

    public readNodeCSV(): Promise<any[]> {
        return this.readCSV(
            this.selectedNodeFileFromInput,
            this.importConfig.nodeFile.hasHeader,
            this.importConfig.nodeFile.delimiter
        );
    }

    public async importGraphFromCSV() {
        const config = this.importConfig;

        // the CSV lib we use uses int index when there's not header/column names specified
        const fromColumn = config.edgeFile.hasHeader
            ? config.edgeFile.mapping.fromId
            : parseInt(config.edgeFile.mapping.fromId);
        const toColumn = config.edgeFile.hasHeader
            ? config.edgeFile.mapping.toId
            : parseInt(config.edgeFile.mapping.toId);

        let tempNodes: any[] = [];
        let tempEdges: any[] = [];

        const graph = new Graph({
            allowSelfLoops: true,
            multi: false,
            type: "undirected",
        });

        // parse Node file and store into the Graph DS
        if (config.hasNodeFile) {
            tempNodes = await this.readNodeCSV();
            tempNodes.forEach((node) => {
                let options: IHiddenOptions = {
                    show: true,
                    cluster: node[config.nodeFile.mapping.cluster].toString(),
                };
                node._options = options;
                graph.addNode(
                    node[config.nodeFile.mapping.id].toString(),
                    node
                );
            });
        }

        // parse Edge file and store into the Graph DS
        tempEdges = await this.readEdgeCSV();
        tempEdges.forEach((edge) => {
            let fromId = edge[fromColumn].toString();
            let toId = edge[toColumn].toString();

            if (!graph.hasNode(fromId)) {
                let options: IHiddenOptions = {
                    show: true,
                    cluster: null,
                };
                let data = { id: fromId, _options: options };
                graph.addNode(fromId, data);
            }
            if (!graph.hasNode(toId)) {
                let options: IHiddenOptions = {
                    show: true,
                    cluster: null,
                };
                let data = { id: toId, _options: options };
                graph.addNode(toId, data);
            }
            graph.addEdge(fromId, toId);
        });

        config.edgeFile.isReady = true;

        let nodeProperties = config.hasNodeFile
            ? Object.keys(tempNodes[0])
            : ["id"];

        return {
            graph: graph,
            metadata: {
                snapshotName: "Untitled",
                nodeProperties: nodeProperties,
                clusterProperties: config.hasNodeFile
                    ? null
                    : config.nodeFile.mapping.cluster,
                edgeProperties: ["source_id", "target_id"],
            },
        };
    }

    //TODO:import 里的id和cluster， source target还没设置
    public async importGraphFromGEXF() {
        const reader = new FileReader();
        reader.readAsText(this.selectedGEXFFileFromInput);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                let graph: Graph = gexf.parse(Graph, <string>reader.result);

                // add _options to Graph, if missing
                graph.forEachNode((key: string, attribute: object) => {
                    if (attribute.hasOwnProperty("_options")) {
                        return;
                    }
                    let options: IHiddenOptions = {
                        show: true,
                        cluster: null,
                    };
                    graph.setNodeAttribute(key, "_options", options);
                });

                let nodeProperties: string[] = [];

                for (const [key, value] of Object.entries(
                    graph.getNodeAttributes(graph.nodes()[0])
                )) {
                    nodeProperties.push(key);
                }

                return {
                    graph: graph,
                    metadata: {
                        snapshotName: "Untitled",
                        nodeProperties: nodeProperties,
                        clusterProperties: null,
                        edgeProperties: ["source_id", "target_id"],
                    },
                };
            };
        });
    }

    public renderImportGEXFPreview(): void {}

    public renderImportEdgePreview(): void {
        trace();
        let file = this.selectedEdgeFileFromInput;
        let edgeFileConfig = this.importConfig.edgeFile;
        let hasHeader = edgeFileConfig.hasHeader;
        let delimiter = edgeFileConfig.delimiter;

        edgeFileConfig.parseError = false;

        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            // Read entire CSV into memory as string
            let fileAsString = <string>reader.result;

            // if the file is not regularly formatted, replace the EOL character
            fileAsString = fileAsString.replace(/\r\n/g, "\n");
            fileAsString = fileAsString.replace(/\r/g, "\n");

            // Get top 10ß lines. Or if there's less than 10 line, get all the lines.
            const lines = fileAsString.split("\n");
            const topLinesAsString = lines
                .map((l) => l.trim())
                .slice(0, lines.length < 10 ? lines.length : 10)
                .join("\n");
            console.log(topLinesAsString);

            // Parse the top lines
            try {
                const it = hasHeader
                    ? parse(topLinesAsString, {
                          comment: "#",
                          trim: true,
                          auto_parse: true,
                          skip_empty_lines: true,
                          columns: hasHeader,
                          delimiter: delimiter,
                      })
                    : parse(topLinesAsString, {
                          comment: "#",
                          trim: true,
                          auto_parse: true,
                          skip_empty_lines: true,
                          columns: undefined,
                          delimiter: delimiter,
                      });
                edgeFileConfig.topN = it;
                edgeFileConfig.columns = <any>(
                    Object.keys(it[0]).map((key) => `${key}`)
                );

                // if there exists two or more columns in the parsed edge file
                if (edgeFileConfig.columns.length >= 2) {
                    edgeFileConfig.mapping.fromId = edgeFileConfig.columns[0];
                    edgeFileConfig.mapping.toId = edgeFileConfig.columns[1];
                    edgeFileConfig.isReady = true;
                } else if (edgeFileConfig.columns.length == 1) {
                    edgeFileConfig.mapping.fromId = edgeFileConfig.mapping.toId =
                        edgeFileConfig.columns[0];
                    edgeFileConfig.isReady = true;
                } else {
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: Fails to parse file",
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                    edgeFileConfig.parseError = true;
                }
            } catch {
                Toaster.create({
                    position: Position.TOP,
                }).show({
                    message: "Error: Fails to parse file",
                    intent: Intent.DANGER,
                    timeout: -1,
                });
                edgeFileConfig.parseError = true;
            }
        };

        reader.onerror = () => {
            console.error(reader.error);
            Toaster.create({
                position: Position.TOP,
            }).show({
                action: {
                    onClick: () => window.location.reload(),
                    text: "Refresh Page",
                },
                message: "Error: Fails to open file",
                intent: Intent.DANGER,
                timeout: -1,
            });
        };
    }

    public renderImportNodePreview(): void {
        trace();
        let file = this.selectedNodeFileFromInput;
        let nodeFileConfig = this.importConfig.nodeFile;
        let hasHeader = nodeFileConfig.hasHeader;
        let delimiter = nodeFileConfig.delimiter;

        nodeFileConfig.parseError = false;

        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = () => {
            // Read entire CSV into memory as string
            let fileAsString = <string>reader.result;

            // if the file is not regularly formatted, replace the EOL character
            fileAsString = fileAsString.replace(/\r\n/g, "\n");
            fileAsString = fileAsString.replace(/\r/g, "\n");

            // Get top 10 lines. Or if there's less than 10 line, get all the lines.
            const lines = fileAsString.split("\n");
            const topLinesAsString = lines
                .map((l) => l.trim())
                .slice(0, lines.length < 10 ? lines.length : 10)
                .join("\n");
            console.log(topLinesAsString);

            // Parse the top lines
            try {
                const it = hasHeader
                    ? parse(topLinesAsString, {
                          comment: "#",
                          trim: true,
                          auto_parse: true,
                          skip_empty_lines: true,
                          columns: hasHeader,
                          delimiter,
                      })
                    : parse(topLinesAsString, {
                          comment: "#",
                          trim: true,
                          auto_parse: true,
                          skip_empty_lines: true,
                          columns: undefined,
                          delimiter,
                      });
                nodeFileConfig.topN = it;
                nodeFileConfig.columns = <any>(
                    Object.keys(it[0]).map((key) => `${key}`)
                );

                // if there exists two or more columns in the parsed edge file
                if (nodeFileConfig.columns.length >= 2) {
                    nodeFileConfig.mapping.id = nodeFileConfig.columns[0];
                    nodeFileConfig.mapping.cluster = nodeFileConfig.columns[1];
                    nodeFileConfig.isReady = true;
                } else if (nodeFileConfig.columns.length == 1) {
                    nodeFileConfig.mapping.id = nodeFileConfig.mapping.cluster =
                        nodeFileConfig.columns[0];
                    nodeFileConfig.isReady = true;
                } else {
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: Fails to parse file",
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                    nodeFileConfig.parseError = true;
                }
            } catch {
                Toaster.create({
                    position: Position.TOP,
                }).show({
                    message: "Error: Fails to parse file",
                    intent: Intent.DANGER,
                    timeout: -1,
                });
                nodeFileConfig.parseError = true;
            }
        };

        reader.onerror = () => {
            console.error(reader.error);
            Toaster.create({
                position: Position.TOP,
            }).show({
                action: {
                    onClick: () => window.location.reload(),
                    text: "Refresh Page",
                },
                message: "Error: Fails to open file",
                intent: Intent.DANGER,
                timeout: -1,
            });
        };
    }
}
