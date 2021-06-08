import React from "react";
import { MenuDivider } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../../state";
import { MenuItemWithTooltip } from "../../utils/MenuItemWithTooltip";
import { Popover2 } from "@blueprintjs/popover2";
import FormClusterOptionsCard from "../../utils/FormClusterOptionsCard";
import { Vector3 } from "three";

export default observer(
    /**
     * @description sub component to render options for RightClickClusterPanel
     * @author Zichen XU, Zhiyuan LYU
     */
    class RightClickClusterPanel extends React.Component {
        state = {
            mergeSelectedClustersOpen: false,
            mergeNeighborsOpen: false,
            mergeNearestClustersOpen: false,
        };

        /**
         * @description loop through the selected clusters and set the nodes within that cluster
         * @author Zichen XU
         */
        mergeSelectedClusters(attribute: string, value: string | number) {
            State.clusterInteraction.selectedClusters.forEach((uuid) => {
                const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                    uuid
                ) as string | number;
                const keys = State.cluster.attributeKeys.get(clusterValue);
                keys?.forEach((nodeId) => {
                    State.graph.rawGraph.setNodeAttribute(
                        nodeId,
                        attribute,
                        value
                    );
                });
            });
            State.cluster.setCluster(attribute);
            State.clusterInteraction.flush();
        }

        /**
         * @description preview the selected cluster with its neighbors
         * @author Zichen XU, Chenghao SHI
         */
        previewClusterNeighbors(uuid: string) {
            State.clusterInteraction.selectedClusters = [uuid];
            const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                uuid
            ) as string | number;
            const nodeIds = State.cluster.attributeKeys.get(clusterValue);
            let attributes: (string | number)[] = [];
            nodeIds?.forEach((nodeId) => {
                State.graph.rawGraph.forEachNeighbor(nodeId, (neighbor) => {
                    const attribute = State.cluster.keyAttribute.get(neighbor)!;
                    if (!attributes.includes(attribute)) {
                        attributes.push(attribute);
                    }
                });
            });
            attributes.forEach((attribute) => {
                State.clusterInteraction.selectedClusters.push(
                    State.graphDelegate.clusterObject.clusterObjectsMap?.get(
                        attribute
                    )?.uuid!
                );
            });
        }

        /**
         * @description preview the nearest cluster with its neighbors
         * @author Zichen XU
         */
        previewNearestNeighbors(uuid: string) {
            function computeDistance(from: Vector3) {
                const current = State.graphDelegate.clusterObject.getObjectById(
                    uuid
                )!.position;
                return current.distanceTo(from);
            }

            State.clusterInteraction.selectedClusters = [uuid];
            const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
                uuid
            ) as string | number;
            const nodeIds = State.cluster.attributeKeys.get(clusterValue);
            let attributes: (string | number)[] = [];
            nodeIds?.forEach((nodeId) => {
                State.graph.rawGraph.forEachNeighbor(nodeId, (neighbor) => {
                    const attribute = State.cluster.keyAttribute.get(neighbor)!;
                    if (!attributes.includes(attribute)) {
                        attributes.push(attribute);
                    }
                });
            });
            const objects = attributes
                .map((attribute) => {
                    return State.graphDelegate.clusterObject.clusterObjectsMap?.get(
                        attribute
                    )?.uuid!;
                })
                .map((uuid) => {
                    return State.graphDelegate.clusterObject.getObjectById(
                        uuid
                    );
                });

            if (objects.length !== 0) {
                let shortest = objects[0];
                objects.forEach((object) => {
                    if (
                        computeDistance(object?.position!) <
                        computeDistance(shortest?.position!)
                    ) {
                        shortest = object;
                    }
                });
                State.clusterInteraction.selectedClusters.push(shortest?.uuid!);
            }
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
                    <Popover2
                        popoverClassName={"transparent-popover"}
                        isOpen={this.state.mergeSelectedClustersOpen}
                        content={
                            <FormClusterOptionsCard
                                callback={(
                                    attribute: string,
                                    value: number | string
                                ) => {
                                    this.mergeSelectedClusters(
                                        attribute,
                                        value
                                    );
                                    this.setState({
                                        mergeSelectedClustersOpen: false,
                                    });
                                    State.preferences.rightClickPanelOpen = false;
                                }}
                            />
                        }
                    >
                        <MenuItemWithTooltip
                            tooltipText="Merge selected clusters into a larger cluster"
                            icon="group-objects"
                            text="Merge Clusters"
                            onClick={() => {
                                this.closeAllPanel();
                                this.setState({
                                    mergeSelectedClustersOpen: true,
                                });
                            }}
                            disabled={
                                State.clusterInteraction.selectedClusters
                                    .length === 0 ||
                                State.clusterInteraction.selectedClusters
                                    .length === 1
                            }
                        />
                    </Popover2>

                    <Popover2
                        popoverClassName={"transparent-popover"}
                        isOpen={this.state.mergeNeighborsOpen}
                        content={
                            <FormClusterOptionsCard
                                callback={(
                                    attribute: string,
                                    value: number | string
                                ) => {
                                    this.mergeSelectedClusters(
                                        attribute,
                                        value
                                    );
                                    this.setState({
                                        mergeNeighborsOpen: false,
                                    });
                                    State.preferences.rightClickPanelOpen = false;
                                }}
                                style={{ opacity: "50%" }}
                            />
                        }
                    >
                        <MenuItemWithTooltip
                            tooltipText="Merge this cluster with its neighbors"
                            icon="group-objects"
                            text="Merge Neighbors"
                            onClick={() => {
                                this.previewClusterNeighbors(
                                    State.clusterInteraction
                                        .chosenCluster as string
                                );
                                State.graphDelegate.clusterObject.updateAllMaterials();
                                this.closeAllPanel();
                                this.setState({
                                    mergeNeighborsOpen: true,
                                });
                            }}
                        />
                    </Popover2>

                    <Popover2
                        popoverClassName={"transparent-popover"}
                        isOpen={this.state.mergeNearestClustersOpen}
                        content={
                            <FormClusterOptionsCard
                                callback={(
                                    attribute: string,
                                    value: number | string
                                ) => {
                                    this.mergeSelectedClusters(
                                        attribute,
                                        value
                                    );
                                    this.setState({
                                        mergeNearestClustersOpen: false,
                                    });
                                    State.preferences.rightClickPanelOpen = false;
                                }}
                            />
                        }
                    >
                        <MenuItemWithTooltip
                            tooltipText="Merge this cluster with its nearest neighbor"
                            icon="group-objects"
                            text="Merge Nearest Neighbor"
                            onClick={() => {
                                this.previewNearestNeighbors(
                                    State.clusterInteraction
                                        .chosenCluster as string
                                );
                                State.graphDelegate.clusterObject.updateAllMaterials();
                                this.closeAllPanel();
                                this.setState({
                                    mergeNearestClustersOpen: true,
                                });
                            }}
                        />
                    </Popover2>
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

        componentWillUnmount = () => {
            this.closeAllPanel();
        };

        closeAllPanel() {
            this.setState({
                mergeSelectedClustersOpen: false,
                mergeNeighborsOpen: false,
                mergeNearestClustersOpen: false,
            });
        }
    }
);
