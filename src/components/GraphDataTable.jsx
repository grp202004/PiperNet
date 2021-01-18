import React from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    Switch,
    ButtonGroup,
    Card,
    Elevation,
} from "@blueprintjs/core";
import { Column, Table, Cell } from "@blueprintjs/table";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../state/index";
import SimpleSelect from "./utils/SimpleSelect";

export default observer(
    class GraphTable extends React.Component {
        state = {
            sortBy: "None",
            sortOrder: "Descending", // or 'Ascending'
        };

        rawGraph = State.graph.rawGraph;
        rawTable = State.graph.rawTable;
        nodeProperties = State.graph.metadata.nodeProperties;

        showRenderer = (rowIndex) => {
            let node = this.rawTable[rowIndex];

            return (
                <Cell>
                    <Switch
                        checked={node.attributes._options.show}
                        onChange={() => {
                            node.attributes._options.show
                                ? State.graph.hideNode(node.key)
                                : State.graph.showNode(node.key);
                            this.forceUpdate();
                        }}
                    />
                </Cell>
            );
        };

        renderColumns = () => {
            const columns = this.nodeProperties.map((it, i) => {
                if (it != "_options") {
                    return (
                        <Column
                            name={it}
                            cellRenderer={(rowIndex, columnIndex) => {
                                let attribute = this.nodeProperties[
                                    columnIndex - 2
                                ];
                                let cellAttributes = this.rawTable[rowIndex]
                                    .attributes;
                                let cell = cellAttributes[attribute];
                                return <Cell>{cell}</Cell>;
                            }}
                        />
                    );
                }
            });
            return columns.filter((element) => {
                return element != undefined;
            });
        };

        render() {
            return (
                <div className="argo-table-container">
                    <Card interactive={false} elevation={Elevation.ONE}>
                        Sort By
                        <SimpleSelect
                            items={this.nodeProperties}
                            value={this.state.sortBy}
                            onSelect={(selected) => {
                                this.setState({ sortBy: selected });
                            }}
                        />
                        <SimpleSelect
                            items={["Descending", "Ascending"]}
                            value={this.state.sortOrder}
                            onSelect={(selected) => {
                                this.setState({ sortOrder: selected });
                            }}
                        />
                    </Card>
                    <Table
                        className="pt-bordered pt-striped"
                        numRows={this.rawGraph.order}
                    >
                        {/* first column is the Show switch */}
                        <Column
                            name="Show"
                            intent={Intent.SUCCESS}
                            cellRenderer={this.showRenderer}
                        />
                        <Column
                            name="id(Designated)"
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
