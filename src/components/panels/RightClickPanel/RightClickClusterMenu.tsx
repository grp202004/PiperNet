import React from "react";
import { MenuDivider } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../../state";
import { MenuItemWithTooltip } from "../../utils/MenuItemWithTooltip";

export default observer(
    /**
     * @description This component will be used when mouse right-clicked. There will be some operation choices on this panel.
     * @author Zichen XU, Zhiyuan LYU
     * @extends {React.Component}
     */
    class RightClickClusterPanel extends React.Component {
        /**
         * @description loop through the selected clusters and set the nodes within that cluster
         * the newly-formed attribute is named _merge-cluster
         * and the value to that attribute is the Time() of this time
         * other nodes unrelated will be set to empty string in this attribute
         * @author Zichen XU
         */
        mergeSelectedClusters() {
            let date = new Date().toLocaleString("en");
            let clusterId: string = `Cluster Merged @ ${date}`;
            if (
                !State.graph.metadata.nodeProperties.includes("_merge-cluster")
            ) {
                State.graph.metadata.nodeProperties.push("_merge-cluster");
            }
            State.graph.rawGraph.forEachNode((_, attributes) => {
                attributes["_merge-cluster"] = "";
            });
            State.clusterInteraction.selectedClusters.forEach((uuid) => {
                const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                    uuid
                ) as string | number;
                const keys = State.cluster.attributeKeys.get(clusterValue);
                keys?.forEach((nodeId) => {
                    State.graph.rawGraph.setNodeAttribute(
                        nodeId,
                        "_merge-cluster",
                        clusterId
                    );
                });
            });
            State.cluster.setCluster("_merge-cluster");
            State.clusterInteraction.flush();
        }

        /**
         * @description delete the selected clusters and its corresponding nodes
         * @author Zichen XU
         */
        deleteSelectedClusters() {
            State.clusterInteraction.selectedClusters.forEach((uuid) => {
                const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                    uuid
                ) as string | number;
                const keys = State.cluster.attributeKeys.get(clusterValue);
                keys?.forEach((nodeId: string) => {
                    State.graph.rawGraph.dropNode(nodeId);
                });
            });
            State.cluster.setCluster(null, true);
            State.clusterInteraction.flush();
        }

        mergeNeighbors() {
            const clsuterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                State.clusterInteraction.selectedCluster as string
            ) as string | number;
            let index;
            const keys = State.cluster.attributeKeys.get(clsuterValue);
            keys?.forEach((nodeId) => {
                State.graph.rawGraph.forEachNeighbor(nodeId, (neighbour) => {
                    State.graphDelegate.clusterObject.UUID2ClusterValueMap.forEach(
                        (value, key) => {
                            if (
                                value ===
                                State.graph.rawGraph.getNodeAttribute(
                                    neighbour,
                                    State.cluster.clusterBy as string
                                )
                            ) {
                                if (
                                    (index =
                                        State.clusterInteraction.selectedClusters.indexOf(
                                            key
                                        ) === -1)
                                ) {
                                    State.clusterInteraction.selectedClusters.push(
                                        key
                                    );
                                }
                            }
                        }
                    );
                });
            });
            this.mergeSelectedClusters();
        }

        /**
         * @description loop through the selected clusters and set the nodes within that cluster
         * @author Zichen XU
         */
        releaseSelectedClusters() {
            State.clusterInteraction.selectedClusters.forEach((uuid) => {
                const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                    uuid
                ) as string | number;
                const keys = State.cluster.attributeKeys.get(clusterValue);
                keys?.forEach((nodeId) => {
                    State.graph.rawGraph.setNodeAttribute(
                        nodeId,
                        State.cluster.clusterBy as string,
                        ""
                    );
                });
            });
            State.cluster.setCluster(State.cluster.clusterBy, true);
            State.clusterInteraction.flush();
        }

        render() {
            return (
                <>
                    <MenuDivider title="Cluster Operation" />
                    <MenuItemWithTooltip
                        tooltipText="Merge selected clusters into a larger cluster"
                        icon="group-objects"
                        text="Merge Clusters"
                        onClick={() => {
                            this.mergeSelectedClusters();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                        disabled={
                            State.clusterInteraction.selectedClusters.length ===
                                0 ||
                            State.clusterInteraction.selectedClusters.length ===
                                1
                        }
                    />
                    <MenuItemWithTooltip
                        tooltipText="Merge this cluster with its neighbors"
                        icon="group-objects"
                        text="Merge Neighbors"
                        onClick={() => {
                            this.mergeNeighbors();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItemWithTooltip
                        tooltipText="Merge this cluster with its nearest neighbor"
                        icon="group-objects"
                        text="Merge Nearest Neighbor"
                        onClick={() => {
                            this.mergeNeighbors();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                    <MenuItemWithTooltip
                        tooltipText="Release selected clusters from the included nodes"
                        icon="group-objects"
                        text="Release Cluster(s)"
                        onClick={() => {
                            this.releaseSelectedClusters();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItemWithTooltip
                        tooltipText="Delete this cluster and its associated nodes from the graph"
                        icon="delete"
                        text="Delete Cluster(s)"
                        onClick={() => {
                            this.deleteSelectedClusters();
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                </>
            );
        }
    }
);
