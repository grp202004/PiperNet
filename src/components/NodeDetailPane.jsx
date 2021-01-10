import React from "react";
import classnames from "classnames";
import { Card, Classes } from "@blueprintjs/core";
import State from "../state/index";
import { observer } from "mobx-react/index";

export default observer(
    class NodeDetailPane extends React.Component {
        // if only a single node is selected
        renderSingleSelection() {
            return (
                <div
                    className={classnames({
                        [Classes.DARK]: State.preferences.darkMode,
                    })}
                >
                    <Card
                        elevation={Elevation.THREE}
                        className={classnames("node-details-table")}
                    >
                        <table
                            className={classnames(
                                Classes.TABLE,
                                Classes.TABLE_STRIPED
                            )}
                            style={{
                                width: "100%",
                                padding: "0",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {State.graph.allPropertiesKeyList.map(
                                    (it, i) => (
                                        <tr key={`${it}-${i}`}>
                                            <td style={{ padding: "5px 10px" }}>
                                                {it}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "5px 10px",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                {formatLongFloat(
                                                    this.props.node[it]
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
            );
        }

        render() {
            // If input is number,
            // currently format number between 0-1 (eg. pagerank)
            // to show no more than 3 significant digits.
            const formatLongFloat = (nodeAttributeValue) => {
                const num = Number(nodeAttributeValue);
                if (Number.isNaN(num) || num > 1 || num < 0) {
                    // Do not format just return original
                    return nodeAttributeValue;
                }
                // Format to no more than 3 significant digit.
                return Number.parseFloat(num).toPrecision(3);
            };

            return (
                <div
                    className={classnames(
                        // 'overlay-card',
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
                        <table
                            className={classnames(
                                Classes.TABLE,
                                Classes.TABLE_STRIPED
                            )}
                            style={{
                                width: "100%",
                                padding: "0",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appState.graph.allPropertiesKeyList.map(
                                    (it, i) => (
                                        <tr key={`${it}-${i}`}>
                                            <td style={{ padding: "5px 10px" }}>
                                                {it}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "5px 10px",
                                                    whiteSpace: "normal",
                                                }}
                                            >
                                                {formatLongFloat(
                                                    this.props.node[it]
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
    }
);
