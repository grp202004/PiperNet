import React from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    Switch,
    Callout,
} from "@blueprintjs/core";
import {
    Column,
    Table,
    Cell,
    EditableCell,
    TableLoadingOption,
    ICellRenderer,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";

let GraphNodeTable = observer(
    class GraphNodeTable extends React.Component {
        rawGraph = State.graph.rawGraph;

        get rawTable() {
            return this.rawGraph.export().nodes;
        }
        nodeProperties = State.graph.metadata.nodeProperties;

        showRenderer: ICellRenderer = (rowIndex) => {
            let node = this.rawTable[rowIndex];

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
            let cellAttributes = this.rawTable[rowIndex].attributes;
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
            let id = this.rawTable[rowIndex].key;
            let numberVal = Number(value);
            if (isNaN(numberVal)) {
                this.rawGraph.setNodeAttribute(id, attribute, value);
            } else {
                this.rawGraph.setNodeAttribute(id, attribute, numberVal);
            }
            this.forceUpdate();
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

                    <Table className="argo-table" numRows={this.rawGraph.order}>
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
                                let id = this.rawTable[rowIndex].key;
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
