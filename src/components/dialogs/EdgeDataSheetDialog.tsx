import React from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    Switch,
    Callout,
    Alert,
    Code,
    InputGroup,
} from "@blueprintjs/core";
import {
    Column,
    Table,
    Cell,
    ICellRenderer,
    Regions,
    RenderMode,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";
import { Attributes, SerializedEdge } from "graphology-types";
import { action, computed, makeObservable } from "mobx";
import { handleStringChange } from "../utils/InputFormUtils";

let GraphEdgeTable = observer(
    class GraphEdgeTable extends React.Component {
        constructor(props: any) {
            super(props);
        }

        state = {
            deleteAlertOpen: false,
            edgeToDelete: null as SerializedEdge<Attributes> | null,
            filterQuery: "",
        };

        get filteredTable() {
            let newTable: SerializedEdge<Attributes>[] = [];
            State.graph.rawGraph.export().edges.forEach((edge) => {
                if (
                    edge.source
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    edge.target
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    this.state.filterQuery == ""
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

        deleteEdge = () => {
            State.graph.rawGraph.dropEdge(
                this.state.edgeToDelete?.key as string
            );
        };

        style = {
            textAlign: "center",
        };

        render() {
            return (
                <div>
                    <InputGroup
                        asyncControl={true}
                        leftIcon="search"
                        onChange={handleStringChange((value) => {
                            this.setState({ filterQuery: value });
                        })}
                        placeholder="Search any Source or Target of a Node..."
                        value={this.state.filterQuery}
                    />
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

                    <Alert
                        cancelButtonText="Cancel"
                        confirmButtonText="Confirm Delete"
                        icon="trash"
                        intent={Intent.DANGER}
                        isOpen={this.state.deleteAlertOpen}
                        onCancel={() =>
                            this.setState({ deleteAlertOpen: false })
                        }
                        onConfirm={() => {
                            this.deleteEdge();
                            this.setState({ deleteAlertOpen: false });
                        }}
                    >
                        <p>
                            Are you sure you want to delete the edge with ID{" "}
                            <Code>{this.state.edgeToDelete?.key}</Code> from
                            Node ID{" "}
                            <Code>{this.state.edgeToDelete?.source}</Code> to
                            Node ID{" "}
                            <Code>{this.state.edgeToDelete?.target}</Code>. This
                            action cannot be reversed.
                        </p>
                    </Alert>
                </div>
            );
        }
    }
);

export default observer(
    class EdgeDataSheetDialog extends React.Component {
        constructor(props: any) {
            super(props);
        }

        render() {
            return (
                <DataSheetDialogWrapper for="edge">
                    <GraphEdgeTable />
                </DataSheetDialogWrapper>
            );
        }
    }
);
