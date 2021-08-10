import { Intent, Position, Toaster, TreeNode } from "@blueprintjs/core";
import { makeAutoObservable } from "mobx";
import Graph from "graphology";
import gexf from "graphology-gexf";
import parse from "csv-parse/lib/sync";
import { IMetaData } from "./GraphStore";
import * as d3 from "d3";
import { tree } from "d3";

/**
 * @description interface for the node file being configured
 * @author Zichen XU
 * @export
 * @interface INodeFileConfig
 */
export interface INodeFileConfig {
    // the file is successfully parsed and ready for display
    isReady: boolean;
    parseError: boolean;
    path: string;

    // has header at the top
    hasHeader: boolean;

    // Get top 20 lines. Or if there's less than 10 line, get all the lines.
    topN: any[];
    //names for the columns of this csv
    columns: string[];
    mapping: {
        id: string;
    };
    delimiter: string;
}
/**
 * @description interface for the edge file being configured
 * @author Zichen XU
 * @export
 * @interface IEdgeFileConfig
 */
export interface IEdgeFileConfig {
    isReady: boolean;
    parseError: boolean;

    // should save the csv to temp for further change the cluster attribute
    path: string;
    hasHeader: boolean;

    // array of objects storing the
    topN: any[];
    columns: string[];
    mapping: {
        fromId: string;
        toId: string;
    };
    delimiter: string;
}

/**
 * @description interface for the cluster file being configured
 * @author Chen YANG
 * @export
 * @interface IClusterFileConfig
 */
 export interface IClusterFileConfig {
    isReady: boolean;
    parseError: boolean;

    // should save the csv to temp for further change the cluster attribute
    path: string;
    hasHeader: boolean;

    // array of objects storing the
    topN: any[];
    columns: string[];
    mapping: {
        name: string;
        parent: string;
    };
    delimiter: string;
}




/**
 * @description this class defines some necessary configs for the graph-importing procedures
 * such as the `INodeFileConfig` and `IEdgeFileConfig` for customizing the csv/gexf file parsing procedure
 * Other functions like `renderImportNode/EdgePreview` renders the preview table in the ImportDialog
 * and `importGraphFromCSV/GEXF` reads the file input and produce the `graphology` object to be assigned to `GraphStore`
 * with some basic error handling strategies
 * These functions are designed to be synchronized to prevent frozen of UI.
 * @author Zichen XU
 * @export
 */
export default class ImportStore {
    constructor() {
        makeAutoObservable(this);
    }
    // map between the cluster name and the nodes it contains
    clusterMap : Map<string,string[]> | null = null;
    // whether the graph is in importing
    isLoading = false;
    //name of the edge file
    edgeFileName = "Choose Edge File ...";

    //name of the node file
    nodeFileName = "Choose Node File ...";

    //name of the GEXF file
    gexfFileName = "Choose GEXF File ...";

    //name of the cluster file***
    clusterFileName = "Choose Cluster File ...";

    importDialogOpen = false;

    importGEXFDialogOpen = false;

    // specific: File object selected via the file input.
    selectedEdgeFileFromInput!: File;
    selectedNodeFileFromInput!: File;
    selectedClusterFileFromInput!: File;

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
            },
            delimiter: ",",
        } as INodeFileConfig,
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
        } as IEdgeFileConfig,

        clusterFile: {
            isReady: false,
            parseError: false,

            // should save the csv to temp for further change the cluster attribute
            path: "",
            hasHeader: true,

            // array of objects storing the
            topN: [],
            columns: [],
            mapping: {
                name: "Unknown",
                parent: "Unknown",
            },
            delimiter: ",",
        } as IClusterFileConfig,
    };

    /**
     * @description read the CSV file specified by fileObject, with options defined by other paras
     * and return a list of objects containing the key-value pair of attribute-value
     * @author Zichen XU
     * @private
     * @param {File} fileObject
     * @param {boolean} hasHeader
     * @param {string} delimiter
     * @returns {*}  {Promise<any[]>}
     *      * where Object is of { attribute: number | string, anotherAttribute: number | string, ... } type

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
     * @description parse the graph from import GEXF file specified in selectedGEXFFileFromInput
     * and return a Graph object
     * @author Zichen XU
     * @private
     * @returns {*}  {Promise<Graph>}
     */
    private async readGEXF(): Promise<Graph> {
        const file = this.selectedGEXFFileFromInput;
        const reader = new FileReader();
        reader.readAsText(file);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                try {
                    resolve(gexf.parse(Graph, reader.result as string));
                } catch (err) {
                    Toaster.create({
                        position: Position.TOP,
                    }).show({
                        message: "Error: " + err.message,
                        intent: Intent.DANGER,
                        timeout: -1,
                    });
                    this.isLoading = false;
                }
            };
        });
    }

    /**
     * @description helper function to read edge csv and call this.readCSV()
     * @author Zichen XU
     * @returns {*}  {Promise<any[]>}
     */
    public readEdgeCSV(): Promise<any[]> {
        return this.readCSV(
            this.selectedEdgeFileFromInput,
            this.importConfig.edgeFile.hasHeader,
            this.importConfig.edgeFile.delimiter
        );
    }

    /**
     * @description helper function to read node csv and call this.readCSV()
     * @author Zichen XU
     * @returns {*}  {Promise<any[]>}
     */
    public readNodeCSV(): Promise<any[]> {
        return this.readCSV(
            this.selectedNodeFileFromInput,
            this.importConfig.nodeFile.hasHeader,
            this.importConfig.nodeFile.delimiter
        );
    }

    public buildClusterMap(node:d3.HierarchyNode<unknown>){
        if(node.children === undefined){
            return;
        }
        let temparr : string[] = [];
        node.leaves().forEach((leave)=>{
            if(leave.id != undefined){
                temparr.push(leave.id);
            }           
        })
        this.clusterMap?.set(node.id as string,temparr);
        node.children.forEach((child:d3.HierarchyNode<unknown>)=>{
            this.buildClusterMap(child);
        })
    }

    /**
     * @description will create a Graph structure to store the nodes and edges in the imported File
     * should handle whether or not have the NodeFile, whether or not have the header of each file
     * if successfully imported, change the .isReady to be true
     * @author Zichen XU
     * @returns {*}
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
            multi: false,
            type: "undirected",
        });

        // parse Node file and store into the Graph DS
        if (config.hasNodeFile) {
            if (this.importConfig.nodeFile.hasHeader) {
                // if has header, then tempNodes returns an array of objects
                tempNodes = (await this.readNodeCSV()) as Object[];
                tempNodes.forEach((node) => {
                    let nodeId = node[config.nodeFile.mapping.id].toString();
                    delete node[config.nodeFile.mapping.id];
                    graph.addNode(nodeId, node);
                });
            } else {
                // if no header, then tempNodes returns an array of array
                tempNodes = (await this.readNodeCSV()) as any[][];
                tempNodes.forEach((node) => {
                    let nodeId = node[config.nodeFile.mapping.id].toString();
                    let attributes = Object.assign({}, node);
                    delete attributes[config.nodeFile.mapping.id];
                    graph.addNode(nodeId, attributes);
                });
            }
        }

        // parse Edge file and store into the Graph DS
        tempEdges = await this.readEdgeCSV();
        tempEdges.forEach((edge, idx) => {
            let fromId = edge[fromColumn].toString();
            let toId = edge[toColumn].toString();

            if (!graph.hasNode(fromId)) {
                graph.addNode(fromId, {});
            }
            if (!graph.hasNode(toId)) {
                graph.addNode(toId, {});
            }
            graph.addEdgeWithKey(idx, fromId, toId);
        });

        config.edgeFile.isReady = true;

        var reader = new FileReader();
        reader.readAsText(this.selectedClusterFileFromInput);
        

        reader.onload = ()=>{
            let fileResult = reader.result;
            if(fileResult != null){
            
                
                const clusterLink = d3.csvParse(fileResult.toString());
                const clusterRoot = d3.stratify()
                    .id(function(d:any){return d.name})
                    .parentId(function(d:any){return d.parent})
                    (clusterLink);               

                this.clusterMap = new Map<string,string[]>();
                this.buildClusterMap(clusterRoot);
                console.log(this.clusterMap);
                // console.log("test");
                // console.log(".children:"+clusterRoot.children)
                // console.log(".data:"+clusterRoot.data)
                // console.log(".id:"+clusterRoot.id)
                // console.log(".parent:"+clusterRoot.parent)
            }
            
        }

        

        let nodeProperties = config.hasNodeFile
            ? Object.keys(tempNodes[0])
            : ["id"];

        return {
            graph: graph,
            metadata: {
                snapshotName: "Untitled",
                nodeProperties: nodeProperties,
            } as IMetaData,
        };




        
    }

    /**
     * @description will create a Graph structure to store the nodes and edges in the imported File
     * please use try catch to avoid any invalid GEXF file
     * @author Zichen XU
     * @returns {*}
     */
    public async importGraphFromGEXF() {
        let graph = await this.readGEXF();
        let nodeProperties: string[] = [];
        for (const [key] of Object.entries(
            graph.getNodeAttributes(graph.nodes()[0])
        )) {
            nodeProperties.push(key);
        }

        return {
            graph: graph,
            metadata: {
                snapshotName: "Untitled",
                nodeProperties: nodeProperties,
            } as IMetaData,
        };
    }

    /**
     * @description change the importConfig.edgeFile.topN to be the top 10 parsed elements in the input edge file
     * change the importConfig.edgeFile.columns to be the attributes of the imported edge file
     * set the .mapping.fromId and .mapping.toId to be the first and second (if have) attribute of the input edge file.
     *
     * if successfully parsed, set the .isReady to be true, else set the.parseError
     *
     * This function will autorun if user specify the selectedEdgeFileFromInput and the changes that this function will make is to get ready for the rendering of preview Table in the ImportDialog
     *
     * @author Zichen XU
     * @returns {*}
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
                let fileAsString = reader.result as string;

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
                    edgeFileConfig.columns = Object.keys(it[0]).map(
                        (key) => `${key}`
                    );

                    // if there exists two or more columns in the parsed edge file
                    if (edgeFileConfig.columns.length >= 2) {
                        edgeFileConfig.mapping.fromId =
                            edgeFileConfig.columns[0];
                        edgeFileConfig.mapping.toId = edgeFileConfig.columns[1];
                        edgeFileConfig.isReady = true;
                    } else if (edgeFileConfig.columns.length === 1) {
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
     * @description change the importConfig.nodeFile.topN to be the top 10 parsed elements in the input node file
     * change the importConfig.nodeFile.columns to be the attributes of the imported node file
     * set the .mapping.id .mapping.cluster to be the first and second (if have) attribute of the input edge file.
     *
     * if successfully parsed, set the .isReady to be true, else set the.parseError
     *
     * This function will autorun if user specify the selectedNodeFileFromInput and the changes that this function will make is to get ready for the rendering of preview Table in the ImportDialog

     * @author Zichen XU
     * @returns {*} 
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
                let fileAsString = reader.result as string;

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
                    nodeFileConfig.columns = Object.keys(it[0]).map(
                        (key) => `${key}`
                    );

                    // if there exists two or more columns in the parsed edge file
                    if (nodeFileConfig.columns.length >= 1) {
                        nodeFileConfig.mapping.id = nodeFileConfig.columns[0];
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
