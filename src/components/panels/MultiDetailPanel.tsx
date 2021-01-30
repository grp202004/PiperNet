import React from "react";
import classnames from "classnames";
import { Classes } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import { observer } from "mobx-react";
import ComponentRef from "../ComponentRef";
import State from "../../state/index";

export default observer(
    class MultipleNodeDetail extends React.Component {
        render() {
            const formatLongFloat = (nodeAttributeValue: any) => {
                const num = Number(nodeAttributeValue);
                if (Number.isNaN(num) || num > 1 || num < 0) {
                    // Do not format just return original
                    return nodeAttributeValue;
                }
                // Format to no more than 3 significant digit.
                return Number.parseFloat(num.toString()).toPrecision(3);
            };

            return (
                <div
                    className={classnames(
                        "left-bottom-overlay-card",
                        "transparent-frame"
                    )}
                >
                    <div
                        className={classnames(
                            Classes.CARD,
                            "nodes-details-table"
                        )}
                    >
                        <Table numRows={State.graph.selectedNodes.length}>
                            {State.graph.metadata.nodeProperties.map((it) => (
                                <Column
                                    key={it}
                                    name={it}
                                    cellRenderer={(i) => (
                                        <Cell>
                                            {State.graph.rawGraph.getNodeAttribute(
                                                State.graph.selectedNodes[
                                                    i
                                                ] as string,
                                                it as string
                                            )}
                                        </Cell>
                                    )}
                                />
                            ))}
                        </Table>
                    </div>
                </div>
            );
        }
        componentDidMount = () => {
            ComponentRef.multiNodeDetail = this;
        };
    }
);