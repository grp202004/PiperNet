import { Toaster, Position, Intent } from "@blueprintjs/core";
import { observable, makeObservable } from "mobx";
import createGraph from "ngraph.graph";
import parse from "csv-parse/lib/sync";
import { Link as Edge, Node, Graph } from "ngraph.graph";

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
    selectedEdgeFileFromInput!: File;
    selectedNodeFileFromInput!: File;

    selectedGEXFFileFromInput!: File;

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
    ): Promise<any[]> {
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

    private getProperties(raw: any[]): string[] | null {
        return raw.length == 0 ? null : Object.keys(raw[0]);
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

        const graph = createGraph();

        // parse Node file and store into the Graph DS
        if (config.hasNodeFile) {
            tempNodes = await this.readNodeCSV();
            tempNodes.forEach((node) => {
                let data: any = node;
                data._cluster = node[
                    config.nodeFile.mapping.cluster
                ].toString();

                graph.addNode(
                    node[config.nodeFile.mapping.id].toString(),
                    data
                );
            });
        }

        // parse Edge file and store into the Graph DS
        tempEdges = await this.readEdgeCSV();
        tempEdges.forEach((edge) => {
            let fromId = edge[fromColumn].toString();
            let toId = edge[toColumn].toString();

            if (!graph.hasNode(fromId)) {
                let data = { id: fromId, _cluster: null };
                graph.addNode(fromId, data);
            }
            if (!graph.hasNode(toId)) {
                let data = { id: toId, _cluster: null };
                graph.addNode(toId, data);
            }
            graph.addLink(fromId, toId);
        });

        config.edgeFile.isReady = true;

        return {
            graph: graph,
            metadata: {
                snapshotName: "Untitled",
                nodeProperties: this.getProperties(tempNodes),
                clusterProperties: config.hasNodeFile
                    ? null
                    : config.nodeFile.mapping.cluster,
                edgeProperties: ["source_id", "target_id"],
            },
        };
    }
}
