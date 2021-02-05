import React from "react";
import { Intent, Switch, Callout, InputGroup } from "@blueprintjs/core";
import {
    Column,
    Table,
    Cell,
    EditableCell,
    ICellRenderer,
    RenderMode,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";
import { action, computed, makeObservable, observable } from "mobx";
import { handleStringChange } from "../utils/InputFormUtils";
import { Attributes, SerializedNode } from "graphology-types";

let GraphNodeTable = observer(
    class GraphNodeTable extends React.Component {
        constructor(props: any) {
            super(props);
        }

        state = {
            filterQuery: "",
        };

        get filteredTable() {
            let newTable: SerializedNode<Attributes>[] = [];
            State.graph.rawGraph.export().nodes.forEach((node) => {
                if (
                    node.key
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    this.state.filterQuery == ""
                ) {
                    newTable.push(node);
                }
            });
            return newTable;
        }

        nodeProperties = State.graph.metadata.nodeProperties;

        showRenderer: ICellRenderer = (rowIndex) => {
            let node = this.filteredTable[rowIndex];

            return (
                <Cell>
                    <Switch
                        checked={node.attributes?._options.show}
                        onChange={() => {
                            node.attributes?._options.show
                                ? State.graph.hideNode(node.key)
                                : State.graph.showNode(node.key);
                            this.forceUpdate();
                        }}
                    />
                </Cell>
            );
        };

        renderCell: ICellRenderer = (rowIndex, columnIndex) => {
            let attribute = this.nodeProperties[columnIndex - 2];
            let cellAttributes = this.filteredTable[rowIndex].attributes;
            //@ts-ignore
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
                />
            );
        };

        // if the input is a number in string, it will convert the string into number to store
        setValue = (value: string, rowIndex: number, attribute: string) => {
            let id = this.filteredTable[rowIndex].key;
            let numberVal = Number(value);
            if (isNaN(numberVal)) {
                State.graph.rawGraph.setNodeAttribute(id, attribute, value);
            } else {
                State.graph.rawGraph.setNodeAttribute(id, attribute, numberVal);
            }
            console.log(State.graph.rawGraph.getNodeAttribute(id, attribute));
        };

        renderColumns: any = () => {
            const columns = this.nodeProperties.map((it, i) => {
                if (it != "_options") {
                    return <Column name={it} cellRenderer={this.renderCell} />;
                }
            });
            return columns.filter((element) => {
                return element != undefined;
            });
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
                    <InputGroup
                        asyncControl={true}
                        leftIcon="search"
                        onChange={handleStringChange((value) => {
                            this.setState({ filterQuery: value });
                        })}
                        placeholder="Search any Node..."
                        value={this.state.filterQuery}
                    />
                    <hr />

                    <Table
                        className="argo-table"
                        numRows={this.filteredTable.length}
                    >
                        {/* first column is the Show switch */}
                        <Column
                            name="Show"
                            //@ts-ignore
                            intent={Intent.SUCCESS}
                            cellRenderer={this.showRenderer}
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
                </div>
            );
        }
    }
);

export default observer(
    class NodeDataSheetDialog extends React.Component {
        constructor(props: any) {
            super(props);
        }

        render() {
            return (
                <DataSheetDialogWrapper for="node">
                    <GraphNodeTable />
                </DataSheetDialogWrapper>
            );
        }
    }
);
