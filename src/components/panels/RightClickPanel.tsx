import React from "react";
import { Classes, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import { computed, makeObservable } from "mobx";

interface Props {
    /**
     * what place this RightClick interaction is activated
     *
     * @type {("Node" | "Cluster" | "Background")}
     */
    on: "Node" | "Cluster" | "Background";
}

export default observer(
    class RightClickPanel extends React.Component<Props, {}> {
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

        formNewCluster() {
            let date = new Date().toLocaleString("en");
            let newClusterAttributeValue: string = `Cluster Generated @ ${date}`;
            if (!State.graph.metadata.nodeProperties.includes("new-cluster")) {
                State.graph.metadata.nodeProperties.push("new-cluster");
            }
            if (!State.graph.metadata.nodeProperties.includes("new-cluster")) {
                State.graph.rawGraph.forEachNode((_, attributes) => {
                    attributes["new-cluster"] = "";
                });
            }
            State.interaction.selectedNodes.forEach((nodeId) => {
                State.graph.rawGraph.setNodeAttribute(
                    nodeId,
                    "new-cluster",
                    newClusterAttributeValue
                );
            });
            State.preferences.rightClickPanelOpen = false;
            State.cluster.setCluster("new-cluster");
            State.interaction.flush();
        }

        releaseFromCluster() {
            const clusterName = State.cluster.clusterBy as string;
            State.interaction.selectedNodes.forEach((nodeId) => {
                State.graph.rawGraph.setNodeAttribute(nodeId, clusterName, "");
            });
            State.preferences.rightClickPanelOpen = false;
            State.cluster.setCluster(State.cluster.clusterBy, true);
            State.interaction.flush();
        }

        renderNodeMenu() {
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
                                State.interaction.selectedNode) as string
                        }
                    />
                    <MenuItem
                        icon="graph-remove"
                        text="Delete Node"
                        onClick={() => {
                            State.graph.mutating.dropNode(
                                State.interaction.selectedNode as string
                            );
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon="inner-join"
                        text="Form a New Cluster"
                        onClick={this.formNewCluster}
                        disabled={State.interaction.selectedNodes.length === 0}
                    />
                    <MenuItem
                        icon="ungroup-objects"
                        text="Release from Cluster"
                        onClick={this.releaseFromCluster}
                        disabled={State.interaction.selectedNodes.length === 0}
                    />
                    <MenuItem
                        icon="eraser"
                        text="Cancel Selection"
                        onClick={() => {
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                        disabled={State.interaction.selectedNodes.length === 0}
                    />
                    <MenuItem
                        icon="graph-remove"
                        text="Delete Selected Nodes"
                        onClick={() => {
                            State.interaction.selectedNodes.forEach((node) => {
                                State.graph.mutating.dropNode(node);
                            });
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon="new-link"
                        text="Add Edge"
                        onClick={() => {
                            State.preferences.AddEdgeDialogOpen = true;
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItem
                        icon="cross"
                        text="Delete Edge"
                        onClick={() => {
                            State.preferences.deleteEdgePanelOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                </Menu>
            );
        }

        renderClusterMenu() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuItem
                        icon="group-objects"
                        text="Merge Cluster"
                        onClick={() => {
                            State.clusterInteraction.mergeSelectedClusters();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItem
                        icon="group-objects"
                        text="Release Cluster"
                        onClick={() => {
                            State.clusterInteraction.releaseSelectedClusters();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                </Menu>
            );
        }

        renderBackgroundMenu() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuItem
                        icon="new-object"
                        text="Add Node"
                        onClick={() => {
                            State.preferences.AddNodeDialogOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                </Menu>
            );
        }

        render() {
            if (this.props.on === "Node") {
                return this.renderNodeMenu();
            } else if (this.props.on === "Cluster") {
                return this.renderClusterMenu();
            } else if (this.props.on === "Background") {
                return this.renderBackgroundMenu();
            }
        }
    }
);
