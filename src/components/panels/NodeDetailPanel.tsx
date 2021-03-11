import React from "react";
import classnames from "classnames";
import { Classes } from "@blueprintjs/core";
import { Cell, Column, EditableCell, Table } from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state/index";
import ComponentRef from "../ComponentRef";

interface Props {
    /**
     * the node id of the select node
     *
     * @type {string}
     * @memberof Props
     */
    onNode: string;
}

export default observer(
    class NodeDetail extends React.Component<Props, {}> {
        cellRenderer_property = (rowIndex: number) => {
            return <Cell>{State.graph.metadata.nodeProperties[rowIndex]}</Cell>;
        };

        cellRenderer_value = (rowIndex: number) => {
            let data = State.graph.rawGraph.getNodeAttribute(
                this.props.onNode,
                State.graph.metadata.nodeProperties[rowIndex]
            );
            // return a Editable Cell where user can edit the value of certain property;
            return (
                <EditableCell
                    value={data}
                    onChange={(newVal) =>
                        State.graph.rawGraph.setNodeAttribute(
                            this.props.onNode,
                            State.graph.metadata.nodeProperties[rowIndex],
                            newVal
                        )
                    }
                    onConfirm={(newVal) =>
                        State.graph.rawGraph.setNodeAttribute(
                            this.props.onNode,
                            State.graph.metadata.nodeProperties[rowIndex],
                            newVal
                        )
                    }
                    tooltip={data}
                />
            );
        };

        formatLongFloat = (nodeAttributeValue: any) => {
            const num = Number(nodeAttributeValue);
            if (Number.isNaN(num) || num > 1 || num < 0) {
                // Do not format just return original
                return nodeAttributeValue;
            }
            // Format to no more than 3 significant digit.
            return Number.parseFloat(num.toString()).toPrecision(3);
        };

        render() {
            return (
                <div
                    className={classnames(
                        "right-overlay-card",
                        "transparent-frame"
                    )}
                >
                    <div
                        className={classnames(
                            Classes.CARD,
                            "node-details-table"
                        )}
                    >
                        <Table
                            numRows={State.graph.metadata.nodeProperties.length}
                            enableRowHeader={false}
                        >
                            <Column
                                name="Properties"
                                cellRenderer={this.cellRenderer_property}
                            />
                            <Column
                                name="Value"
                                cellRenderer={this.cellRenderer_value}
                            />
                        </Table>
                    </div>
                </div>
            );
        }
        componentDidMount = () => {
            ComponentRef.nodeDetail = React.createRef();
        };
    }
);
