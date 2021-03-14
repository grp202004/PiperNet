import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { polygonContains } from "d3-polygon";
import State from ".";

export default class ClusterInteractionStore {
    constructor() {
        makeAutoObservable(this);
    }
    /**
     * the UUID of cluster Object3D
     *
     * @type {(string | null)}
     */
    currentlyHoveredClusterId: string | null = null;

    selectedCluster: string | null = null;

    selectedClusters: string[] = [];

    flush() {
        this.currentlyHoveredClusterId = null;
        this.selectedCluster = null;
        this.selectedClusters = [];
    }

    clusterLeftClickCallback(uuid: string, event: MouseEvent) {
        State.graphDelegate.clusterObject.meshSpotlightMaterial(
            State.graphDelegate.clusterObject.getObjectById(uuid) as THREE.Mesh
        );
        // multi-selection
        let index;

        State.clusterInteraction.selectedCluster = uuid;

        // if already in the list of selected, remove
        if (
            (index = State.clusterInteraction.selectedClusters.indexOf(
                uuid
            )) !== -1
        ) {
            State.clusterInteraction.selectedClusters.splice(index, 1);
        } else {
            // if not in the list, add
            State.clusterInteraction.selectedClusters.push(uuid);
        }
    }

    clusterHoverCallback(uuid: string | null, event: MouseEvent) {
        State.clusterInteraction.currentlyHoveredClusterId = uuid;
    }

    clusterRightClickCallback(uuid: string | null, event: MouseEvent) {
        State.clusterInteraction.selectedCluster = uuid;
        State.preferences.rightClickPositionX = event.x;
        State.preferences.rightClickPositionY = event.y;
        if (uuid) {
            State.preferences.rightClickOn = "Cluster";
        } else {
            State.preferences.rightClickOn = "Background";
        }
        State.preferences.rightClickPanelOpen = true;
        State.preferences.closeAllPanel("rightClickPanel");
    }

    /**
     * loop through the selected clusters and set the nodes within that cluster
     * the newly-formed attribute is named _merge-cluster
     * and the value to that attribute is the Time() of this time
     * other nodes unrelated will be set to empty string in this attribute
     *
     */
    mergeSelectedCluster() {
        let date = new Date().toLocaleString("en");
        let clusterId: string = `Cluster Merged @ ${date}`;
        if (!State.graph.metadata.nodeProperties.includes("_merge-cluster")) {
            State.graph.metadata.nodeProperties.push("_merge-cluster");
        }
        State.graph.rawGraph.forEachNode((_, attributes) => {
            attributes["_merge-cluster"] = "";
        });
        this.selectedClusters.forEach((uuid) => {
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
        this.flush();
    }

    drawPanelActivate: boolean = false;

    lineSegment!: any[];

    confirmClusterSplittingTempData:
        | {
              [key: string]: any;
              id: string;
              x: number;
              y: number;
          }[]
        | null = null;

    computeSplitCluster() {
        let screenCoords = [] as {
            id: string;
            x: number;
            y: number;
            [key: string]: any;
        }[];
        State.graph.rawGraph.forEachNode((node, attribute) => {
            let coord = State.graphDelegate.graphDelegateMethods.graph2ScreenCoords(
                attribute._visualize.x,
                attribute._visualize.y,
                attribute._visualize.z
            );
            screenCoords.push({ id: node, x: coord.x, y: coord.y });
        });

        let tempLineSegment: [number, number][] = this.lineSegment.map(
            (value) => {
                return [value.x, value.y];
            }
        );

        screenCoords.forEach((value) => {
            let inside = polygonContains(tempLineSegment, [value.x, value.y]);

            if (inside) {
                State.interaction.updateNodeVisualizeAttribute(value.id, {
                    selected: true,
                });
                value["value"] = 1;
            } else {
                State.interaction.updateNodeVisualizeAttribute(value.id, {
                    selected: false,
                });
                value["value"] = 0;
            }
        });

        State.graphDelegate.graphDelegateMethods.refresh();
        this.confirmClusterSplittingTempData = screenCoords;
    }

    splitCluster() {
        let date = new Date().toLocaleString("en");
        const clusterId: string = `Cluster Split @ ${date}`;
        const anotherClusterId: string = `Another Cluster Split @ ${date}`;
        const thisCluster = State.cluster.clusterBy;

        const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
            this.selectedCluster as string
        ) as string | number;
        const nodesToAlter = State.cluster.attributeKeys.get(
            clusterValue
        ) as string[];
        this.confirmClusterSplittingTempData?.forEach((node) => {
            if (nodesToAlter.includes(node.id)) {
                State.graph.rawGraph.setNodeAttribute(
                    node.id,
                    thisCluster as string,
                    node["value"] === 1 ? clusterId : anotherClusterId
                );
            }
        });
        this.confirmClusterSplittingTempData = null;
        State.cluster.setCluster(thisCluster, true);
    }
}
