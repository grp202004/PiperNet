import React from "react";
import { observer } from "mobx-react";
import pluralize from "pluralize";
import State from "../../state";
import GlobalPanel from "./GlobalPanel";
import SelectionPanel from "./SelectionPanel";

export default observer(
    class NodesPanel extends React.Component {
        getRenderedNodes = () => {
            if (State.graph.selectedNodes.length === 0) {
                return (
                    <div>
                        <p>Modifying All Nodes</p>
                    </div>
                );
            }
            return (
                <p>{`Modifying ${pluralize(
                    "Node",
                    State.graph.selectedNodes.length,
                    true
                )}`}</p>
            );
        };

        render() {
            return (
                <div>
                    {this.getRenderedNodes()}
                    {State.graph.selectedNodes.length === 0 ? (
                        <GlobalPanel />
                    ) : (
                        <SelectionPanel />
                    )}
                </div>
            );
        }
    }
);
