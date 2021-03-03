import React from "react";
import classnames from "classnames";
import { Classes, Button } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table";
import { observer } from "mobx-react";
import ComponentRef from "../ComponentRef";
import State from "../../state/index";

export default observer(
    class MultipleNodeDetail extends React.Component {
        render() {
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
                        <Button
                            icon="undo"
                            onClick={() => {
                                State.interaction.selectedNodes = [];
                            }}
                        >
                            cancel select
                        </Button>
                        <Button
                            icon="delete"
                            onClick={() => {
                                State.interaction.selectedNodes = [];
                            }}
                        >
                            Delete all
                        </Button>
                        <Button
                            icon="circle"
                            onClick={() => {
                                State.interaction.selectedNodes = [];
                            }}
                        >
                            Cluster
                        </Button>
                    </div>
                </div>
            );
        }
        componentDidMount = () => {
            ComponentRef.multiNodeDetail = this;
        };
    }
);
