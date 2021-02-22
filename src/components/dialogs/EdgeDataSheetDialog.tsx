import React from "react";
import {
    Alert,
    Button,
    ButtonGroup,
    Callout,
    Classes,
    Code,
    Dialog,
    Divider,
    InputGroup,
    Intent,
} from "@blueprintjs/core";
import {
    Cell,
    Column,
    ICellRenderer,
    RenderMode,
    Table,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";
import { Attributes, SerializedEdge } from "graphology-types";
import { handleStringChange } from "../utils/InputFormUtils";
import NodeChooser from "../utils/NodeChooser";

let GraphEdgeTable = observer(
    class GraphEdgeTable extends React.Component {
        state = {
            addEdgeDialogOpen: false,
            deleteAlertOpen: false,
            edgeToDelete: null as null | SerializedEdge<Attributes>,
            filterQuery: null as null | string,
            chosenSource: null as null | string,
            chosenTarget: null as null | string,
        };

        get filteredTable() {
            let newTable: SerializedEdge<Attributes>[] = [];
            State.graph.rawGraph.export().edges.forEach((edge) => {
                if (
                    !this.state.filterQuery ||
                    edge.source
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    edge.target
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    this.state.filterQuery === ""
                ) {
                    newTable.push(edge);
                }
            });
            return newTable;
        }

        deleteEdgeRenderer: ICellRenderer = (rowIndex) => {
            return (
                <Cell>
                    <Button
                        onClick={() => {
                            this.setState({
                                edgeToDelete: this.filteredTable[rowIndex],
                                deleteAlertOpen: true,
                            });
                        }}
                        icon="trash"
                        intent="danger"
                        text="Delete"
                        minimal={true}
                    />
                </Cell>
            );
        };

        deleteEdgeAlert = () => {
            return (
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Confirm Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.deleteAlertOpen}
                    onCancel={() => this.setState({ deleteAlertOpen: false })}
                    onConfirm={() => {
                        State.graph.rawGraph.dropEdge(
                            this.state.edgeToDelete?.key as string
                        );
                        this.setState({ deleteAlertOpen: false });
                    }}
                >
                    <p>
                        Are you sure you want to delete the edge with ID{" "}
                        <Code>{this.state.edgeToDelete?.key}</Code> from Node ID{" "}
                        <Code>{this.state.edgeToDelete?.source}</Code> to Node
                        ID <Code>{this.state.edgeToDelete?.target}</Code>. This
                        action cannot be reversed.
                    </p>
                </Alert>
            );
        };

        addEdgeDialog = () => {
            return (
                <Dialog
                    isOpen={this.state.addEdgeDialogOpen}
                    icon="new-link"
                    onClose={() => this.setState({ addEdgeDialogOpen: false })}
                    onClosed={() =>
                        this.setState({
                            chosenSource: null,
                            chosenTarget: null,
                        })
                    }
                    title="Add Edge"
                >
                    <div className={Classes.DIALOG_BODY}>
                        <p>
                            <strong>
                                You can only add unique undirected edges to the
                                graph dataset.
                            </strong>
                        </p>
                        <p>
                            A <em>UNIQUE</em> edge means there should only exist
                            one edge that connects between the source and the
                            target.
                        </p>
                        <ButtonGroup fill={true}>
                            <NodeChooser
                                text="Source Node"
                                onChange={(value) => {
                                    this.setState({ chosenSource: value });
                                }}
                            />
                            <Divider />
                            <NodeChooser
                                text="Target Node"
                                onChange={(value) => {
                                    this.setState({ chosenTarget: value });
                                }}
                            />
                        </ButtonGroup>
                        <p>New edges are added to the end of the table.</p>
                        {!this.canImport && (
                            <Callout
                                title="Invalid Edge"
                                intent="danger"
                                icon="edit"
                            >
                                The new edge is invalid because either this is a
                                edge that already in the graph or cannot form a
                                valid undirected edge
                            </Callout>
                        )}
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() =>
                                    this.setState({ addEdgeDialogOpen: false })
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => {
                                    State.graph.rawGraph.addEdge(
                                        this.state.chosenSource!,
                                        this.state.chosenTarget!
                                    );
                                    this.setState({ addEdgeDialogOpen: false });
                                }}
                                disabled={!this.canImport}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Dialog>
            );
        };

        get canImport(): boolean {
            if (!this.state.chosenSource || !this.state.chosenTarget) {
                return false;
            } else if (this.state.chosenSource === this.state.chosenTarget) {
                return false;
            } else {
                return (
                    !State.graph.rawGraph.hasEdge(
                        this.state.chosenSource,
                        this.state.chosenTarget
                    ) &&
                    !State.graph.rawGraph.hasEdge(
                        this.state.chosenTarget,
                        this.state.chosenSource
                    )
                );
            }
        }

        style = {
            textAlign: "center",
        };

        render() {
            return (
                <div>
                    <ButtonGroup>
                        <Button
                            onClick={() => this.forceUpdate()}
                            icon="refresh"
                            intent="none"
                            text="Refresh"
                        />
                        <Button
                            onClick={() =>
                                this.setState({ addEdgeDialogOpen: true })
                            }
                            icon="new-link"
                            intent="primary"
                            text="Add Edge"
                        />
                        <Divider />
                        <InputGroup
                            asyncControl={true}
                            leftIcon="search"
                            onChange={handleStringChange((value) => {
                                this.setState({ filterQuery: value });
                            })}
                            placeholder="Search any Source or Target of a Node..."
                            value={this.state.filterQuery ?? ""}
                        />
                    </ButtonGroup>

                    <hr />
                    <Table
                        className="argo-table"
                        numRows={this.filteredTable.length}
                        defaultRowHeight={30}
                        renderMode={RenderMode.NONE}
                    >
                        <Column
                            name=""
                            cellRenderer={this.deleteEdgeRenderer}
                            //@ts-ignore
                            style={this.style}
                        />
                        <Column
                            name="Source"
                            //@ts-ignore
                            intent={Intent.PRIMARY}
                            cellRenderer={(rowIndex) => {
                                return (
                                    <Cell>
                                        {this.filteredTable[rowIndex].source}
                                    </Cell>
                                );
                            }}
                        />
                        <Column
                            name="Target"
                            //@ts-ignore
                            intent={Intent.PRIMARY}
                            cellRenderer={(rowIndex) => {
                                return (
                                    <Cell>
                                        {this.filteredTable[rowIndex].target}
                                    </Cell>
                                );
                            }}
                        />
                    </Table>
                    {this.deleteEdgeAlert()}
                    {this.addEdgeDialog()}
                </div>
            );
        }
    }
);

export default observer(
    class EdgeDataSheetDialog extends React.Component {
        render() {
            return (
                <DataSheetDialogWrapper for="edge">
                    <GraphEdgeTable />
                </DataSheetDialogWrapper>
            );
        }
    }
);
