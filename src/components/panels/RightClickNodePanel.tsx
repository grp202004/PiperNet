import React from "react";
import { Classes, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import { computed, makeObservable } from "mobx";

export default observer(
    class RightClickNodePanel extends React.Component {
        constructor(props: any) {
            super(props);
            makeObservable(this, {
                stylePosition: computed,
            });
        }
        get stylePosition() {
            return {
                top: State.preferences.rightClickPositionY + 10 + "px",
                left: State.preferences.rightClickPositionX + 10 + "px",
            };
        }

        render() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuDivider
                        title={
                            ("Node ID: " +
                                State.interaction.chNodeIdforDisplay) as string
                        }
                    />
                    <MenuItem
                        icon="graph-remove"
                        text="Delete Node"
                        onClick={() => {
                            State.graph.mutating.dropNode(
                                State.interaction.chNodeIdforDisplay as string
                            );
                            State.preferences.rightClickNodePanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon="circle"
                        text="CLuster Node"
                        onClick={() => {
                            let clusterId: number =
                                State.graph.numberOfClusters + 1;
                            State.interaction.selectedNodes.map((nodeid) => {
                                let after = State.graph.rawGraph.setNodeAttribute(
                                    nodeid,
                                    "cluster",
                                    clusterId
                                );
                            });
                            State.graph.numberOfClusters++;
                            State.preferences.rightClickNodePanelOpen = false;
                            State.cluster.setCluster("cluster");
                        }}
                        disabled={State.interaction.selectedNodes.length === 0}
                    />
                    <MenuItem
                        icon="undo"
                        text="cancel multiple select"
                        onClick={() => {
                            State.interaction.selectedNodes = [];
                            State.preferences.rightClickNodePanelOpen = false;
                        }}
                        disabled={State.interaction.selectedNodes.length === 0}
                    />
                    <MenuItem
                        icon="graph-remove"
                        text="Delete selected Nodes"
                        onClick={() => {
                            State.interaction.selectedNodes.forEach((node) => {
                                State.graph.mutating.dropNode(node);
                            });
                            // State.graph.mutating.dropNode(
                            //     State.interaction.chNodeIdforDisplay as string
                            // );
                            State.preferences.rightClickNodePanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon="new-link"
                        text="Add Edge"
                        onClick={() => {
                            State.preferences.AddEdgeDialogOpen = true;
                        }}
                    />
                    <MenuItem
                        icon="cross"
                        text="Delete Edge"
                        onClick={() => {
                            State.preferences.deleteEdgePanelOpen = true;
                            State.preferences.rightClickNodePanelOpen = false;
                        }}
                    />
                </Menu>
            );
        }
    }
);
