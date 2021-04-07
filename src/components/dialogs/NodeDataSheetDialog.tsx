import React from "react";
import {
    Alert,
    Button,
    ButtonGroup,
    Callout,
    Code,
    Divider,
    InputGroup,
    Intent,
} from "@blueprintjs/core";
import {
    Cell,
    Column,
    EditableCell,
    ICellRenderer,
    Table,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";
import {
    handleStringChange,
    parseNumberOrString,
    stringifyNodeDetail,
} from "../utils/InputFormUtils";
import { Attributes, SerializedNode } from "graphology-types";

let GraphNodeTable = observer(
    class GraphNodeTable extends React.Component {
        state = {
            filterQuery: "",
            addNodeDialogOpen: false,
            deleteAlertOpen: false,
            nodeToDelete: null as SerializedNode | null,
        };

        get filteredTable() {
            let newTable: SerializedNode[] = [];
            State.graph.rawGraph.export().nodes.forEach((node) => {
                if (
                    node.key
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    this.state.filterQuery === ""
                ) {
                    newTable.push(node);
                }
            });
            return newTable;
        }

        nodeProperties = State.graph.metadata.nodeProperties;

        renderColumns: any = () => {
            const columns = this.nodeProperties.map((it, i) => {
                if (it !== "_options") {
                    return (
                        <Column
                            name={it}
                            cellRenderer={(
                                rowIndex: number,
                                columnIndex: number
                            ) => this.renderCell(rowIndex, it)}
                        />
                    );
                }
                return null;
            });
            return columns.filter((element) => {
                return element !== undefined;
            });
        };

        renderCell = (rowIndex: number, attribute: string) => {
            let cellAttributes = this.filteredTable[rowIndex].attributes!!;
            let cell = cellAttributes[attribute];

            return (
                <EditableCell
                    value={cell}
                    onChange={(newVal) =>
                        this.setValue(newVal, rowIndex, attribute)
                    }
                    onConfirm={(newVal) =>
                        this.setValue(newVal, rowIndex, attribute)
                    }
                    tooltip={cell}
                />
            );
        };

        // if the input is a number in string, it will convert the string into number to store
        setValue = (value: string, rowIndex: number, attribute: string) => {
            let id = this.filteredTable[rowIndex].key;
            State.graph.rawGraph.setNodeAttribute(
                id,
                attribute,
                parseNumberOrString(value)
            );
        };

        deleteNodeRenderer: ICellRenderer = (rowIndex) => {
            return (
                <Cell>
                    <Button
                        onClick={() => {
                            this.setState({
                                nodeToDelete: this.filteredTable[rowIndex],
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

        deleteNodeAlert = () => {
            return (
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Confirm Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.deleteAlertOpen}
                    onCancel={() => this.setState({ deleteAlertOpen: false })}
                    onConfirm={() => {
                        State.graph.mutating.dropNode(
                            this.state.nodeToDelete?.key as string
                        );
                        this.setState({ deleteAlertOpen: false });
                    }}
                    style={{ minWidth: "60vw" }}
                >
                    <p>
                        Are you sure you want to delete the node with ID{" "}
                        <Code>{this.state.nodeToDelete?.key}</Code> with
                        attributes:
                        <Code>
                            {stringifyNodeDetail(
                                this.state.nodeToDelete
                                    ?.attributes as Attributes
                            )}
                        </Code>
                        This action cannot be reversed.
                    </p>
                </Alert>
            );
        };

        style = {
            textAlign: "center",
        };

        render() {
            return (
                <div>
                    <Callout
                        title={
                            "Try to click on a cell and type in something..."
                        }
                        intent="primary"
                        icon="edit"
                    >
                        The corresponding value of a node's attribute can be
                        modified by clicking the cell and type in
                    </Callout>

                    <ButtonGroup>
                        <Button
                            onClick={() => this.forceUpdate()}
                            icon="refresh"
                            intent="none"
                            text="Refresh"
                        />
                        <Button
                            onClick={() => {
                                State.preferences.AddNodeDialogOpen = true;
                            }}
                            icon="new-object"
                            intent="primary"
                            text="Add Node"
                        />
                        <Divider />
                        <InputGroup
                            style={{ width: "40vw" }}
                            asyncControl={true}
                            leftIcon="search"
                            onChange={handleStringChange((value) => {
                                this.setState({ filterQuery: value });
                            })}
                            placeholder="Search any Node..."
                            value={this.state.filterQuery}
                            fill={true}
                        />
                    </ButtonGroup>

                    <hr />

                    <Table
                        className="argo-table"
                        defaultRowHeight={30}
                        numRows={this.filteredTable.length}
                    >
                        <Column
                            name=""
                            cellRenderer={this.deleteNodeRenderer}
                            //@ts-ignore
                            style={this.style}
                        />
                        <Column
                            name="ID"
                            //@ts-ignore
                            intent={Intent.SUCCESS}
                            cellRenderer={(rowIndex) => {
                                let id = this.filteredTable[rowIndex].key;
                                return <Cell>{id}</Cell>;
                            }}
                        />
                        {this.renderColumns()}
                    </Table>
                    {this.deleteNodeAlert()}
                </div>
            );
        }
    }
);

export default observer(
    /**
     * @description the node data sheet table
     * @author Zichen XU
     * @class NodeDataSheetDialog
     * @extends {React.Component}
     */
    class NodeDataSheetDialog extends React.Component {
        render() {
            return (
                <DataSheetDialogWrapper for="node">
                    <GraphNodeTable />
                </DataSheetDialogWrapper>
            );
        }
    }
);
