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
        nodeProperties = State.graph.metadata.nodeProperties;

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
                    <table className="argo-table-container__table pt-table pt-bordered pt-striped">
                        <thead>
                            <tr>
                                <th>
                                    <b>Show</b>
                                </th>
                                <th>
                                    <b>Node ID</b>
                                </th>
                                {this.nodeProperties.map((it, i) => {
                                    if (it !== "id") {
                                        return <th key={`${it}-${i}`}>{it}</th>;
                                    }
                                    return null;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.rawGraph.forEachNode((node) => (
                                <tr key={node.id}>
                                    <td>
                                        <Switch
                                            checked={node.data._options.show}
                                            onChange={() => {
                                                if (node.data._options.show) {
                                                    State.graph.showNodes([
                                                        node.id,
                                                    ]);
                                                } else {
                                                    State.graph.hideNodes([
                                                        node.id,
                                                    ]);
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>{node.id}</td>
                                    {this.nodeProperties.map((it, i) => {
                                        if (it !== "id") {
                                            return (
                                                <td key={`${it}-${i}`}>
                                                    {node.data[it]}
                                                </td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
);
