import React from "react";
import classnames from "classnames";
import { Card } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import { observer } from "mobx-react";
import ComponentRef from "../ComponentRef";
import State from "../../state/index";

export default observer(
    /**
     * @description This component will be used when multiple-choose nodes.
     * @author Zhiyuan Lyu
     * @extends {React.Component}
     */
    class MultipleNodeDetail extends React.Component {
        render() {
            return (
                <div
                    className={classnames(
                        "left-bottom-overlay-card",
                        "transparent-frame"
                    )}
                >
                    <Card>
                        <Table numRows={State.interaction.selectedNodes.length}>
                            {State.graph.metadata.nodeProperties.map((it) => (
                                <Column
                                    key={it}
                                    name={it}
                                    cellRenderer={(i) => (
                                        <Cell>
                                            {State.graph.rawGraph.getNodeAttribute(
                                                State.interaction.selectedNodes[
                                                    i
                                                ] as string,
                                                it as string
                                            )}
                                        </Cell>
                                    )}
                                />
                            ))}
                        </Table>
                    </Card>
                </div>
            );
        }
        componentDidMount = () => {
            ComponentRef.multiNodeDetail = this;
        };
    }
);
