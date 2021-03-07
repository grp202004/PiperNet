import React from "react";
import {
    Button,
    Callout,
    Classes,
    Dialog,
    Divider,
    FileInput,
    Intent,
    Spinner,
    Switch,
    Tag,
} from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import classnames from "classnames";
import { observer } from "mobx-react";
import State from "../../state";

import Collapsable from "../utils/Collapsable";
import SimpleSelect from "../utils/SimpleSelect";
import { NODE_AND_EDGE_FILE, ONLY_EDGE_FILE } from "../../constants";
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
    class ImportCSVDialog extends React.Component {
        state = {
            loading: false,
            available: ONLY_EDGE_FILE,
            nodesOpen: true,
            edgesOpen: true,
            delimiter: ",",
        };

        // determine if this state is importable
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

        renderNodesSelection = () => {
            const nodeFile = State.import.importConfig.nodeFile;

            // show blank if node file not relevant
            if (this.state.available === ONLY_EDGE_FILE) {
                return null;
            }

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

        render() {
            return (
                <Dialog
                    style={{ minWidth: "80vw" }}
                    icon="import"
                    isOpen={State.import.importCSVDialogOpen}
                    onClose={() => {
                        State.import.importCSVDialogOpen = false;
                    }}
                    title="Import CSV"
                >
                    {/* if is loading, then show Spinner */}
                    {State.import.isLoading ? (
                        <Spinner />
                    ) : (
                        <div>
                            <div
                                className={classnames(
                                    Classes.DIALOG_BODY,
                                    "import-dialog"
                                )}
                            >
                                I have:
                                <SimpleSelect
                                    items={[ONLY_EDGE_FILE, NODE_AND_EDGE_FILE]}
                                    text={this.state.available}
                                    onSelect={(targetValue) => {
                                        State.import.importConfig.hasNodeFile = !(
                                            targetValue === ONLY_EDGE_FILE
                                        );
                                        this.setState({
                                            available: targetValue,
                                        });
                                    }}
                                />
                                <Divider />
                                {this.renderNodesSelection()}
                                <br />
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

                                                    if(State.cluster.rawGraph.hasAttribute('cluster')){
                                                        State.cluster
                                                        .setCluster(State.graph.rawGraph.getAttribute('cluster'));
                                                    }

                                                    State.import.isLoading = false;
                                                    State.import.importCSVDialogOpen = false;
                                                });
                                        }}
                                        text="Import"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>
            );
        }
    }
);
