import React from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    Spinner,
    Switch,
    Divider,
    FileInput,
} from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import classnames from "classnames";
import { observer } from "mobx-react";
import State from "../state/index";

import Collapsable from "./utils/Collapsable";
import SimpleSelect from "./utils/SimpleSelect";
import { NODE_AND_EDGE_FILE, ONLY_EDGE_FILE } from "../constants/index";

let PreviewTable = observer(
    class PreviewTable extends React.Component {
        render() {
            const file = this.props.file;
            return (
                <Table
                    className="import-preview-table"
                    numRows={20}
                    selectedRegions={Object.values(file.mapping)
                        .map((it) => file.columns.indexOf(it))
                        .map((it) => ({ rows: null, cols: [it, it] }))}
                >
                    {file.columns.map((it) => (
                        <Column
                            key={it}
                            name={it}
                            cellRenderer={(i) => (
                                <Cell>{file.topN[i][it]}</Cell>
                            )}
                        />
                    ))}
                </Table>
            );
        }
    }
);

export default observer(
    class ImportDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                available: ONLY_EDGE_FILE,
                nodesOpen: true,
                edgesOpen: true,
                delimiter: ",",
            };
        }

        // determine if this state is importable
        canImport = () => {
            if (this.state.available === NODE_AND_EDGE_FILE) {
                return (
                    State.import.importConfig.edgeFile.canImport &&
                    State.import.importConfig.nodeFile.canImport
                );
            } else if (this.state.available === ONLY_EDGE_FILE) {
                return State.import.importConfig.edgeFile.canImport;
            }
            return false;
        };

        renderNodesSelection = () => {
            const nodeFile = State.import.importConfig.nodeFile;

            // if file not imported, show blank
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
                                    if (event.target.files.length < 1) {
                                        return;
                                    }
                                    State.import.nodeFileName =
                                        event.target.files[0].name;
                                    // after setting the selectedNodeFileFromInput, other attributes will update automatically
                                    State.import.selectedNodeFileFromInput =
                                        event.target.files[0];
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
                                value={nodeFile.mapping.id}
                                onSelect={(it) => (nodeFile.mapping.id = it)}
                            />
                            <br />
                            Column for Attribute for Cluster:
                            <SimpleSelect
                                items={nodeFile.columns}
                                value={nodeFile.mapping.cluster}
                                onSelect={(it) =>
                                    (nodeFile.mapping.cluster = it)
                                }
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
                                    if (event.target.files.length < 1) {
                                        return;
                                    }
                                    State.import.edgeFileName =
                                        event.target.files[0].name;
                                    State.import.selectedEdgeFileFromInput =
                                        event.target.files[0];
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
                                value={edgeFile.mapping.fromId}
                                onSelect={(it) =>
                                    (edgeFile.mapping.fromId = it)
                                }
                            />{" "}
                            <br />
                            Column for Target ID:
                            <SimpleSelect
                                items={edgeFile.columns}
                                value={edgeFile.mapping.toId}
                                onSelect={(it) => (edgeFile.mapping.toId = it)}
                            />
                        </div>
                    )}
                </Collapsable>
            );
        };

        renderDelimiterSelection() {
            return (
                <div className="column-selection">
                    Selected Delimiter
                    <SimpleSelect
                        items={[",", "\\t", ";", "[SPACE]"]}
                        value={this.state.delimiter}
                        onSelect={(newDelimiter) => {
                            this.setState({ delimiter: newDelimiter });

                            if (newDelimiter == "\\t") {
                                newDelimiter = "\t";
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
                    iconName="import"
                    className={classnames({
                        [Classes.DARK]: State.preferences.darkMode,
                    })}
                    isOpen={State.import.importCSVDialogOpen}
                    onClose={() => {
                        State.import.importCSVDialogOpen = false;
                    }}
                    title="Import CSV"
                >
                    {" "}
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
                                value={this.state.available}
                                onSelect={(targetValue) => {
                                    State.import.importConfig.nodeFile.hasNodeFile = !(
                                        targetValue === ONLY_EDGE_FILE
                                    );
                                    this.setState({ available: targetValue });
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
                                        // // TODO: this might be unsafe, check if there's racing condition
                                        // requestCreateNewProject({
                                        //     name: State.project.newProjectName,
                                        //     createdDate: new Date().toLocaleString(),
                                        // });
                                        // requestImportGraphFromCSV(
                                        //     //edgefile.delimiter and nodefile.delimiter are the same
                                        //     this.state.available ===
                                        //         NODE_AND_EDGE_FILE,
                                        //     State.import.importConfig.edgeFile
                                        //         .delimiter,
                                        //     State.project.newProjectName
                                        // );
                                        // // Importing a graph means no label would be shown by default,
                                        // // thus turn off label CSSRenderer for better performance.
                                        // State.graph.frame.turnOffLabelCSSRenderer();
                                    }}
                                    text="Import"
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            );
        }
    }
);
