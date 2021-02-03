import { Toaster, Position, Intent } from "@blueprintjs/core";
import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import gexf from "graphology-gexf";
import parse from "csv-parse/lib/sync";

export default class ImportStore {
    constructor() {
        makeAutoObservable(this);
    }

    // whether the graph is in importing
    isLoading = false;
    //name of the edge file
    edgeFileName = "Choose Edge File ...";

    //name of the node file
    nodeFileName = "Choose Node File ...";

    //name of the GEXF file
    gexfFileName = "Choose GEXF File ...";

    importCSVDialogOpen = false;
    importSamplesDialogOpen = false;
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

    /**
     * read the CSV file specified by fileObject, with options defined by other paras
     * and return a list of objects containing the key-value pair of attribute-value
     *
     * @param {File} fileObject
     * @param {boolean} hasHeader
     * @param {string} delimiter
     * @return {*}  {Promise<Object[]>}
     * where Object is of { attribute: number | string, anotherAttribute: number | string, ... } type
     * @memberof ImportStore
     */
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
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: " + err.message,
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                }
            };
        });
    }

    /**
     * parse the graph from import GEXF file specified in selectedGEXFFileFromInput
     * and return a Graph object
     *
     * @private
     * @return {*}  {Promise<Graph>}
     * @memberof ImportStore
     */
    private async readGEXF(): Promise<Graph> {
        const file = this.selectedGEXFFileFromInput;
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                try {
                    resolve(gexf.parse(Graph, <string>reader.result));
                } catch (err) {
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: " + err.message,
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

    /**
     * will create a Graph structure to store the nodes and edges in the imported File
     * should handle whether or not have the NodeFile, whether or not have the header of each file
     * if successfully imported, change the .isReady to be true
     *
     * @return {*}
     * @memberof ImportStore
     */
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
            multi: true,
            type: "undirected",
        });

        // parse Node file and store into the Graph DS
        if (config.hasNodeFile) {
            tempNodes = await this.readNodeCSV();
            tempNodes.forEach((node) => {
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
                graph.addNode(fromId, { id: fromId });
            }
            if (!graph.hasNode(toId)) {
                graph.addNode(toId, { id: toId });
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
        let graph = await this.readGEXF();
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
    }

    // TODO:
    public renderImportGEXFPreview(): void {}

    /**
     * change the importConfig.edgeFile.topN to be the top 10 parsed elements in the input edge file
     * change the importConfig.edgeFile.columns to be the attributes of the imported edge file
     * set the .mapping.fromId and .mapping.toId to be the first and second (if have) attribute of the input edge file.
     *
     * if successfully parsed, set the .isReady to be true, else set the.parseError
     *
     * This function will autorun if user specify the selectedEdgeFileFromInput and the changes that this function will make is to get ready for the rendering of preview Table in the ImportDialog
     *
     * @return {*}
     * @memberof ImportStore
     */
    public async renderImportEdgePreview() {
        let file = this.selectedEdgeFileFromInput;
        let edgeFileConfig = this.importConfig.edgeFile;
        let hasHeader = edgeFileConfig.hasHeader;
        let delimiter = edgeFileConfig.delimiter;

        edgeFileConfig.parseError = false;

        return new Promise<void>((resolve, reject): void => {
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
                        edgeFileConfig.mapping.fromId =
                            edgeFileConfig.columns[0];
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
                    resolve();
                } catch {
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: Fails to parse file",
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                    edgeFileConfig.parseError = true;
                    reject();
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
                reject();
            };
        });
    }

    /**
     * change the importConfig.nodeFile.topN to be the top 10 parsed elements in the input node file
     * change the importConfig.nodeFile.columns to be the attributes of the imported node file
     * set the .mapping.id .mapping.cluster to be the first and second (if have) attribute of the input edge file.
     *
     * if successfully parsed, set the .isReady to be true, else set the.parseError
     *
     * This function will autorun if user specify the selectedNodeFileFromInput and the changes that this function will make is to get ready for the rendering of preview Table in the ImportDialog
     *
     * @return {*}
     * @memberof ImportStore
     */
    public async renderImportNodePreview() {
        let file = this.selectedNodeFileFromInput;
        let nodeFileConfig = this.importConfig.nodeFile;
        let hasHeader = nodeFileConfig.hasHeader;
        let delimiter = nodeFileConfig.delimiter;

        nodeFileConfig.parseError = false;

        return new Promise<void>((resolve, reject): void => {
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
                        nodeFileConfig.mapping.cluster =
                            nodeFileConfig.columns[1];
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
                    resolve();
                } catch {
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: Fails to parse file",
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                    nodeFileConfig.parseError = true;
                    reject();
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
                reject();
            };
        });
    }
}
