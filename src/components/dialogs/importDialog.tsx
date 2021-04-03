import React from "react";
import {
    Callout,
    Classes,
    FileInput,
    Spinner,
    Switch,
    Tag,
    MultistepDialog,
    DialogStep,
    IButtonProps,
    H4,
    H2,
} from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import classnames from "classnames";
import { observer } from "mobx-react";
import State from "../../state";
import SimpleSelect from "../utils/SimpleSelect";
import { IEdgeFileConfig, INodeFileConfig } from "../../state/ImportStore";

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
    /**
     * @description The multistep dialog for importing csv Node and Edge files
     * @author Chenghao Shi
     * @extends {React.Component}
     */
    class ImportDialog extends React.Component {
        private multiDialogRef = React.createRef<MultistepDialog>();

        state = {
            delimiter: ",",
            step: 0,
        };

        // nextButtonProps = {
        //     disabled:
        //         (this.state.step === 0 &&
        //             !State.import.importConfig.edgeFile.isReady) ||
        //         !(
        //             this.state.step === 2 &&
        //             (!State.import.importConfig.hasNodeFile ||
        //                 (State.import.importConfig.hasNodeFile &&
        //                     State.import.importConfig.nodeFile.isReady))
        //         ),
        // };

        canImport = () => {
            if (State.import.importConfig.hasNodeFile) {
                return (
                    State.import.importConfig.edgeFile.isReady &&
                    State.import.importConfig.nodeFile.isReady
                );
            } else {
                return State.import.importConfig.edgeFile.isReady;
            }
        };

        renderNodesSelection = () => {
            const nodeFile = State.import.importConfig.nodeFile;

            return State.import.importConfig.hasNodeFile ? (
                <>
                    <FileInput
                        text={State.import.nodeFileName}
                        onInputChange={(event) => {
                            let target = event.target as HTMLInputElement;
                            if (!target.files || target.files.length < 1) {
                                return;
                            }
                            State.import.importConfig.hasNodeFile = true;
                            State.import.nodeFileName = target.files[0].name;
                            // after setting the selectedNodeFileFromInput, it will auto render the preview table
                            State.import.selectedNodeFileFromInput =
                                target.files[0];
                        }}
                    />

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
                </>
            ) : (
                <H4>You don't need to import node file</H4>
            );
        };

        renderEdgesSelection = () => {
            const edgeFile = State.import.importConfig.edgeFile;
            return (
                <>
                    <FileInput
                        text={State.import.edgeFileName}
                        onInputChange={(event) => {
                            let target = event.target as HTMLInputElement;
                            if (!target.files || target.files.length < 1) {
                                return;
                            }
                            State.import.edgeFileName = target.files[0].name;
                            State.import.selectedEdgeFileFromInput =
                                target.files[0];
                        }}
                    />
                    <Switch
                        label="Has Headers"
                        checked={edgeFile.hasHeader}
                        onChange={() =>
                            (edgeFile.hasHeader = !edgeFile.hasHeader)
                        }
                    />
                    {edgeFile.isReady && (
                        <div>
                            <PreviewTable file={edgeFile} />
                            <br />
                            Column for Source ID:
                            <SimpleSelect
                                items={edgeFile.columns}
                                text={edgeFile.mapping.fromId}
                                onSelect={(it) =>
                                    (edgeFile.mapping.fromId = it)
                                }
                            />
                            <br />
                            Column for Target ID:
                            <SimpleSelect
                                items={edgeFile.columns}
                                text={edgeFile.mapping.toId}
                                onSelect={(it) => (edgeFile.mapping.toId = it)}
                            />
                        </div>
                    )}
                </>
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
            return <Cell>{State.graph.rawGraph.order}</Cell>;
        };

        importedEdges = () => {
            return <Cell>{State.graph.rawGraph.size}</Cell>;
        };

        closeDialog = () => {
            State.import.importDialogOpen = false;
        };

        finalButtonProps: Partial<IButtonProps> = {
            intent: "primary",
            // disabled: this.canImport(),
            onClick: () => {
                State.import.isLoading = true;
                State.import.importGraphFromCSV().then((res) => {
                    State.graph.setGraph(res.graph, res.metadata);

                    if (State.graph.rawGraph.hasAttribute("default")) {
                        State.cluster.setCluster(
                            State.graph.rawGraph.getAttribute("default")
                        );
                    }

                    State.import.isLoading = false;
                    State.import.importDialogOpen = false;
                });
            },
            text: "Import",
        };

        render() {
            return (
                <MultistepDialog
                    ref={this.multiDialogRef}
                    className={classnames("multistep-dialog-box")}
                    icon="import"
                    isOpen={State.import.importDialogOpen}
                    onClose={() => {
                        State.import.importDialogOpen = false;
                    }}
                    // nextButtonProps={this.nextButtonProps}
                    finalButtonProps={this.finalButtonProps}
                    onChange={(id) => {
                        this.setState({
                            step: id,
                        });
                    }}
                    title="Open Files"
                >
                    <DialogStep
                        id="csv_edge"
                        title="Choose a Edge file"
                        panel={
                            <div
                                className={classnames(
                                    Classes.DIALOG_BODY,
                                    "multistep-dialog-body"
                                )}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                }}
                            >
                                {State.import.isLoading ? (
                                    <Spinner />
                                ) : (
                                    <div>
                                        <div
                                            className={classnames(
                                                Classes.DIALOG_BODY,
                                                "import-dialog"
                                            )}
                                            style={{ maxWidth: "40vw" }}
                                        >
                                            {this.renderEdgesSelection()}
                                            <br />
                                            {this.renderDelimiterSelection()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />
                    <DialogStep
                        id="csv_node_need"
                        title="Do i need to import node file ?"
                        panel={
                            <div
                                className={classnames(
                                    Classes.DIALOG_BODY,
                                    "multistep-dialog-body"
                                )}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <H2>Do i need to import node file?</H2>
                                <H4>
                                    You can import nodes file to add node
                                    attributes to this graph
                                </H4>
                                <p>
                                    To import attributes we will need to proceed
                                    another csv files: a list of nodes, Nodes
                                    must have at least an ID, other fields are
                                    optional
                                </p>
                                <br />
                                <Switch
                                    large={true}
                                    checked={
                                        State.import.importConfig.hasNodeFile
                                    }
                                    label="I want to import node file"
                                    onChange={() =>
                                        (State.import.importConfig.hasNodeFile = !State
                                            .import.importConfig.hasNodeFile)
                                    }
                                />
                            </div>
                        }
                    />
                    <DialogStep
                        id="csv_node"
                        title="Choose a Node file"
                        panel={
                            <div
                                className={classnames(
                                    Classes.DIALOG_BODY,
                                    "multistep-dialog-body"
                                )}
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    display: "flex",
                                }}
                            >
                                {State.import.isLoading ? (
                                    <Spinner />
                                ) : (
                                    <div>
                                        <div
                                            className={classnames(
                                                Classes.DIALOG_BODY,
                                                "import-dialog"
                                            )}
                                            style={{ maxWidth: "40vw" }}
                                        >
                                            {this.renderNodesSelection()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />
                    {/* <DialogStep
                        id="Info"
                        title="Informtion of graph"
                        panel={
                            <div>
                                <Card>
                                    <Table numRows={1}>
                                        <Column
                                            name=" number of Nodes "
                                            cellRenderer={this.importedNodes}
                                        />
                                        <Column
                                            name=" number of Edges "
                                            cellRenderer={this.importedEdges}
                                        />
                                    </Table>
                                </Card>
                                <br />
                                <Divider />
                                <div>
                                    Set an attribute for cluster:
                                    <ClusterChooser
                                        onSelect={(cluster) => {
                                            State.cluster.setCluster(cluster);
                                        }}
                                        syncWith={State.cluster.clusterBy}
                                    />
                                </div>
                            </div>
                        }
                    /> */}
                </MultistepDialog>
            );
        }
    }
);
