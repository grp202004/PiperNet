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
            sortBy: "",
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
                            node.attributes._options.show = !node.attributes
                                ._options.show;
                            this.forceUpdate();
                        }}
                    />
                </Cell>
            );
        };

        dataRenderer = (rowIndex, columnIndex) => {
            let attribute = this.nodeProperties[columnIndex - 1];
            let cell = this.rawTable[rowIndex].attributes[attribute];
            return <Cell>{cell}</Cell>;
        };

        renderColumns = () => {
            return this.nodeProperties.map((it, i) => {
                return <Column name={it} cellRenderer={this.dataRenderer} />;
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
