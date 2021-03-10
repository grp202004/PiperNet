import React, { MouseEventHandler } from "react";
import {
    Alignment,
    Button,
    ButtonGroup,
    Callout,
    Card,
    Classes,
    Dialog,
    Divider,
    FileInput,
    Intent,
    Position,
    Spinner,
    Switch,
    Tag,
    PanelProps,
    PanelStack2,
    Panel,
    MenuItem,
    MultistepDialog,
    DialogStep,
    IButtonProps,
} from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import classnames from "classnames";
import { observer } from "mobx-react";
import State from "../../state";
import { copy } from "copy-anything";
import { Select } from "@blueprintjs/select";
import Collapsable from "../utils/Collapsable";
import SimpleSelect from "../utils/SimpleSelect";
import { NODE_AND_EDGE_FILE, ONLY_EDGE_FILE } from "../../constants";
import { IEdgeFileConfig, INodeFileConfig } from "../../state/ImportStore";
import { ALIGN_RIGHT } from "@blueprintjs/core/lib/esm/common/classes";
import ClusterChooser from "../utils/ClusterChooser";

interface PreviewTableProps {
    file: INodeFileConfig | IEdgeFileConfig;
}

let PreviewTable = observer(
    class PreviewTable extends React.Component<PreviewTableProps, {}> {
        file = this.props.file;

        renderWrapper = () => {
            return this.file.parseError ? (
                <Callout title={"Error Parsing File"} intent="warning">
                    Try with other options of <code>Delimiter</code> or review
                    the file for import to find possible problems.
                </Callout>
            ) : (
                <div>
                    <Table
                        className="import-preview-table"
                        numRows={this.file.topN.length}
                        selectedRegions={Object.values(this.file.mapping)
                            .map((it) => this.file.columns.indexOf(it))
                            .map((it) => ({ rows: null, cols: [it, it] }))}
                    >
                        {this.file.columns.map((it) => (
                            <Column
                                key={it}
                                name={it}
                                cellRenderer={(i) => (
                                    <Cell>{this.file.topN[i][it]}</Cell>
                                )}
                            />
                        ))}
                    </Table>
                    <Tag>
                        Only the top {this.file.topN.length} rows of the
                        selected file are displayed.
                    </Tag>
                </div>
            );
        };

        render() {
            return this.renderWrapper();
        }
    }
);


export default observer(
    class ImportSamplesDialog extends React.Component{
        private multiDialogRef = React.createRef<MultistepDialog>();

        state = {
            fileIsSelect : false,
            loading: false,
            available: ONLY_EDGE_FILE,
            nodesOpen: true,
            edgesOpen: true,
            delimiter: ",",
        }


        canImport = () => {
            if (this.state.available === NODE_AND_EDGE_FILE) {
                return (
                    State.import.importConfig.edgeFile.isReady &&
                    State.import.importConfig.nodeFile.isReady
                );
            } else if (this.state.available === ONLY_EDGE_FILE) {
                return State.import.importConfig.edgeFile.isReady;
            }
            return false;
        };

        renderImportButton() {
            return (
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <ButtonGroup>
                            <Button
                            className={classnames({
                                [Classes.DISABLED]: !this.state.fileIsSelect,
                            })}
                            intent={Intent.PRIMARY}
                            onClick={() => {
                                State.import.isLoading = true;
                                State.import
                                    .importGraphFromGEXF()
                                    .then((res) => {
                                        State.graph.setGraph(
                                            res.graph,
                                            res.metadata
                                        );

                                        if(State.cluster.rawGraph.hasAttribute('default')){
                                            State.cluster
                                            .setCluster(State.graph.rawGraph.getAttribute('default'));
                                        }

                                        State.import.isLoading = false;
                                        State.import.importGEXFDialogOpen = false;
                                        State.import.importSamplesDialogOpen = false;
                                    });
                            }}
                            text="Import"
                        />
                        </ButtonGroup>
                    </div>
                </div>
            );
        }

        renderNodesSelection = () => {
            const nodeFile = State.import.importConfig.nodeFile;

            return (
                <Collapsable
                    name="Nodes"
                    isOpen={this.state.nodesOpen}
                    onToggle={() =>
                        this.setState({ nodesOpen: !this.state.nodesOpen })
                    }
                >
                    <br />
                    <div className={classnames(Classes.CONTROL_GROUP)}>
                        <div
                            className={classnames(
                                Classes.INPUT_GROUP,
                                Classes.FILL
                            )}
                        >
                            <FileInput
                                text={State.import.nodeFileName}
                                onInputChange={(event) => {
                                    let target = event.target as HTMLInputElement;
                                    if (
                                        !target.files ||
                                        target.files.length < 1
                                    ) {
                                        return;
                                    }
                                    this.state.available = NODE_AND_EDGE_FILE;
                                    State.import.nodeFileName =
                                        target.files[0].name;
                                    // after setting the selectedNodeFileFromInput, it will auto render the preview table
                                    State.import.selectedNodeFileFromInput =
                                        target.files[0];
                                }}
                            />
                        </div>
                    </div>
                    <br />
                    <Switch
                        label="Has Headers"
                        checked={nodeFile.hasHeader}
                        onChange={() =>
                            (nodeFile.hasHeader = !nodeFile.hasHeader)
                        }
                    />
                    {nodeFile.isReady && (
                        <div className="column-selection">
                            <PreviewTable file={nodeFile} />
                            <br />
                            Column for Node ID:
                            <SimpleSelect
                                items={nodeFile.columns}
                                text={nodeFile.mapping.id}
                                onSelect={(it) => (nodeFile.mapping.id = it)}
                            />
                        </div>
                    )}
                </Collapsable>
            );
        };

        renderEdgesSelection = () => {
            const edgeFile = State.import.importConfig.edgeFile;
            return (
                <Collapsable
                    name="Edges"
                    isOpen={this.state.edgesOpen}
                    onToggle={() =>
                        this.setState({ edgesOpen: !this.state.edgesOpen })
                    }
                >
                    <br />
                    <div className={classnames(Classes.CONTROL_GROUP)}>
                        <div
                            className={classnames(
                                Classes.INPUT_GROUP,
                                Classes.FILL
                            )}
                        >
                            <FileInput
                                text={State.import.edgeFileName}
                                onInputChange={(event) => {
                                    let target = event.target as HTMLInputElement;
                                    if (
                                        !target.files ||
                                        target.files.length < 1
                                    ) {
                                        return;
                                    }
                                    State.import.edgeFileName =
                                        target.files[0].name;
                                    State.import.selectedEdgeFileFromInput =
                                        target.files[0];
                                }}
                            />
                        </div>
                    </div>
                    <br />
                    <Switch
                        label="Has Headers"
                        checked={edgeFile.hasHeader}
                        onChange={() =>
                            (edgeFile.hasHeader = !edgeFile.hasHeader)
                        }
                    />
                    {edgeFile.isReady && (
                        <div className="column-selection">
                            <PreviewTable file={edgeFile} />
                            <br />
                            Column for Source ID:
                            <SimpleSelect
                                items={edgeFile.columns}
                                text={edgeFile.mapping.fromId}
                                onSelect={(it) =>
                                    (edgeFile.mapping.fromId = it)
                                }
                            />{" "}
                            <br />
                            Column for Target ID:
                            <SimpleSelect
                                items={edgeFile.columns}
                                text={edgeFile.mapping.toId}
                                onSelect={(it) => (edgeFile.mapping.toId = it)}
                            />
                        </div>
                    )}
                </Collapsable>
            );
        };

        renderDelimiterSelection() {
            return (
                <div>
                    Selected Delimiter
                    <SimpleSelect
                        items={[",", "\\t", ";", "[SPACE]"]}
                        text={this.state.delimiter}
                        onSelect={(newDelimiter) => {
                            this.setState({ delimiter: newDelimiter });

                            if (newDelimiter === "\\t") {
                                newDelimiter = "\t";
                            } else if (newDelimiter === "[SPACE]") {
                                newDelimiter = " ";
                            }

                            State.import.importConfig.edgeFile.delimiter = newDelimiter;
                            State.import.importConfig.nodeFile.delimiter = newDelimiter;
                        }}
                    />{" "}
                </div>
            );
        }

        importedNodes = () => {
            return <Cell>{State.graph.rawGraph.order}</Cell>
        }

        importedEdges = () => {
            return <Cell>{State.graph.rawGraph.size}</Cell>
        }

        closeDialog = () => {
            State.import.importSamplesDialogOpen = false;
        }

        nodeFileReady = () => {
            this.state.available = NODE_AND_EDGE_FILE;
        }

        render() {
            let finalButtonProps: Partial<IButtonProps> = {
                intent: "primary",
                onClick: this.closeDialog,
                text: "Close",
            };

            return (
                <MultistepDialog
                    ref = {this.multiDialogRef}
                    icon = "import"
                    isOpen = {State.import.importSamplesDialogOpen}
                    onClose = {() => {
                        State.import.importSamplesDialogOpen = false;
                    }}
                    finalButtonProps = {finalButtonProps}
                    title = "Open Files"
                >
                    <DialogStep
                        id = "select"
                        title = "Choose a type of File"
                        panel = {<div>    
                            <Card className ={classnames(Classes.DIALOG_BODY)}>
                                <ButtonGroup style = {{marginLeft:45}}>
                                <Button 
                                icon = "document-open" 
                                style = {{marginRight:30}} 
                                onClick = {()=>{this.multiDialogRef.current?.setState({selectedIndex : 1})}}>
                                    Open GEXF File
                                </Button>             
                                <Divider/>
                                <Button icon = "document-open" 
                                style = {{marginLeft:30}} 
                                onClick = {()=>{this.multiDialogRef.current?.setState({selectedIndex : 2})}}>
                                    Open CSV File
                                </Button>
                                </ButtonGroup>
                            </Card>
                        </div>}
                    />
                    <DialogStep
                        id = "gexf"
                        title = "Import a GEXF file"
                        panel = {<div> {State.import.isLoading ? (
                            <Spinner />
                        ) : (
                            <div
                                className={classnames(
                                    Classes.DIALOG_BODY,
                                    "import-dialog"
                                )}
                            >
                                <div>
                                    <div
                                        className={classnames(
                                            Classes.CONTROL_GROUP
                                        )}
                                    >
                                        <div
                                            className={classnames(
                                                Classes.INPUT_GROUP,
                                                Classes.FILL
                                            )}
                                        >
                                            <FileInput
                                                text={State.import.gexfFileName}
                                                onInputChange={(event) => {
                                                    let target = event.target as HTMLInputElement;
                                                    if (
                                                        !target.files ||
                                                        target.files.length < 1
                                                    ) {
                                                        return;
                                                    }
                                                    State.import.gexfFileName =
                                                        target.files[0].name;
                                                    // after setting the selectedNodeFileFromInput, it will auto render the preview table
                                                    State.import.selectedGEXFFileFromInput =
                                                        target.files[0];
    
                                                    this.setState({
                                                        fileIsSelect: true,
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {this.renderImportButton()}
                            </div>
                        )}</div>}
                    />
                    <DialogStep
                        id = "csv_edge"
                        title = "Choose a Edge file"
                        panel = {<div>{State.import.isLoading ? (
                            <Spinner />
                        ) : (
                            <div>
                                <div
                                    className={classnames(
                                        Classes.DIALOG_BODY,
                                        "import-dialog",
                                    )}
                                    style = {{maxWidth:"30vw"}}
                                >
                                    {this.renderEdgesSelection()}
                                    <br />
                                    {this.renderDelimiterSelection()}
                                </div>
                                <div className={Classes.DIALOG_FOOTER}>
                                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                    <Button
                                            className={classnames({
                                                [Classes.DISABLED]: !this.canImport(),
                                            })}
                                            style={{marginBottom:5}}
                                            intent={Intent.PRIMARY}
                                            onClick={() => {
                                                State.import.isLoading = true;
                                                State.import
                                                    .importGraphFromCSV()
                                                    .then((res) => {
                                                        State.graph.setGraph(
                                                            res.graph,
                                                            res.metadata
                                                        );
    
                                                        if(State.cluster.rawGraph.hasAttribute('default')){
                                                            State.cluster
                                                            .setCluster(State.graph.rawGraph.getAttribute('default'));
                                                        }
    
                                                        State.import.isLoading = false;
                                                        this.multiDialogRef.current?.setState({selectedIndex : 4});
                                                    });
                                            }}
                                            text="Import"
                                        />
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        )}</div>}
                    />
                    <DialogStep
                        id = "csv_node"
                        title = "Choose a Node file"
                        panel = {<div>{State.import.isLoading ? (
                            <Spinner />
                        ) : (
                            <div>
                                <div
                                    className={classnames(
                                        Classes.DIALOG_BODY,
                                        "import-dialog",
                                    )}
                                    style = {{maxWidth:"30vw"}}
                                >
                                    {this.renderNodesSelection()}

                                </div>
                                <div className={Classes.DIALOG_FOOTER}>
                                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                        <Button
                                            className={classnames({
                                                [Classes.DISABLED]: !this.canImport(),
                                            })}
                                            style={{marginBottom:5}}
                                            intent={Intent.PRIMARY}
                                            onClick={() => {
                                                State.import.isLoading = true;
                                                State.import
                                                    .importGraphFromCSV()
                                                    .then((res) => {
                                                        State.graph.setGraph(
                                                            res.graph,
                                                            res.metadata
                                                        );
    
                                                        if(State.cluster.rawGraph.hasAttribute('default')){
                                                            State.cluster
                                                            .setCluster(State.graph.rawGraph.getAttribute('default'));
                                                        }
    
                                                        State.import.isLoading = false;
                                                        this.multiDialogRef.current?.setState({selectedIndex : 4});
                                                    });
                                            }}
                                            text="Import"
                                        />
                                        <br/>
                                    </div>
                                </div>
                            </div>
                        )}</div>}
                    />
                    <DialogStep
                        id = "Info"
                        title = "Informtion of graph"
                        panel = {<div>
                            <Card>
                                <Table numRows = {1}>
                                    <Column  name = " number of Nodes " cellRenderer = {this.importedNodes}/>
                                    <Column name = " number of Edges " cellRenderer = {this.importedEdges}/>
                                </Table>
                            </Card>
                            <br/>
                            <Divider/>
                            <div>Set an attribute for cluster:
                            <ClusterChooser
                            onSelect={(cluster) => {
                                State.cluster.setCluster(cluster);
                            }}
                            syncWith={State.cluster.clusterBy}
                            /></div>
                        </div>}
                    />
                </MultistepDialog>
            
            );
            
        }
    }
);
