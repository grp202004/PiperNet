import React from "react";
import { MenuDivider } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../../state";
import { MenuItemWithTooltip } from "../../utils/MenuItemWithTooltip";
import { Popover2 } from "@blueprintjs/popover2";
import FormClusterOptionsCard from "../../utils/FormClusterOptionsCard";

export default observer(
    /**
     * @description This component will be used when mouse right-clicked. There will be some operation choices on this panel.
     * @author Zichen XU, Zhiyuan LYU
     * @extends {React.Component}
     */
    class RightClickNodePanel extends React.Component {
        state = {
            formNewClusterOpen: false,
        };

        formNewCluster(attribute: string, value: number | string) {
            State.interaction.selectedNodes.forEach((nodeId) => {
                State.graph.rawGraph.setNodeAttribute(nodeId, attribute, value);
            });
            State.preferences.rightClickPanelOpen = false;
            State.cluster.setCluster(attribute);
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

        render() {
            return (
                <>
                    <MenuDivider
                        title={
                            ("Node ID: " +
                                State.interaction.chosenNode) as string
                        }
                    />
                    <MenuItemWithTooltip
                        tooltipText="Delete this selected node from the graph"
                        icon="graph-remove"
                        text="Delete Node"
                        multiline={true}
                        onClick={() => {
                            State.graph.mutating.dropNode(
                                State.interaction.chosenNode as string
                            );
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItemWithTooltip
                        tooltipText="Delete multiple selected nodes from the graph"
                        icon="graph-remove"
                        text="Delete Selected Nodes"
                        multiline={true}
                        onClick={() => {
                            State.interaction.selectedNodes.forEach((node) => {
                                State.graph.mutating.dropNode(node);
                            });
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                        disabled={
                            State.interaction.selectedNodes.length === 0 ||
                            State.interaction.selectedNodes.length === 1
                        }
                    />

                    <MenuDivider title="Edit Edges" />
                    <MenuItemWithTooltip
                        tooltipText="Add new edge to this graph"
                        icon="new-link"
                        text="Add Edge"
                        onClick={() => {
                            State.preferences.AddEdgeDialogOpen = true;
                            State.interaction.flush();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItemWithTooltip
                        tooltipText="Interactively delete edge that connected to this selected node"
                        icon="cross"
                        text="Delete Edge"
                        onClick={() => {
                            State.preferences.deleteEdgePanelOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider title="Node-Cluster" />
                    <Popover2
                        isOpen={this.state.formNewClusterOpen}
                        content={
                            <FormClusterOptionsCard
                                callback={(attribute, value) => {
                                    this.formNewCluster(attribute, value);
                                    this.setState({
                                        formNewClusterOpen: false,
                                    });
                                    State.preferences.rightClickPanelOpen = false;
                                }}
                            />
                        }
                    >
                        <MenuItemWithTooltip
                            tooltipText="Use the selected nodes to form a new cluster"
                            icon="inner-join"
                            text="Form a New Cluster"
                            onClick={() =>
                                this.setState({
                                    formNewClusterOpen: true,
                                })
                            }
                            disabled={
                                State.interaction.selectedNodes.length === 0
                            }
                        />
                    </Popover2>

                    <MenuItemWithTooltip
                        tooltipText="Release the selected nodes from the cluster where they belongs"
                        icon="ungroup-objects"
                        text="Release from Cluster"
                        onClick={this.releaseFromCluster}
                        disabled={State.interaction.selectedNodes.length === 0}
                    />
                </>
            );
        }

        componentWillUnmount = () => {
            this.setState({ formNewClusterOpen: false });
        };
    }
);
