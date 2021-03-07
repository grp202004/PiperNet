import { makeAutoObservable } from "mobx";
import * as THREE from "three";
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
        let date = new Date().toLocaleString();
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

    lineSegment!: { x: number; y: number }[];

    PointInPoly(
        pt: { x: number; y: number },
        poly: { x: number; y: number }[]
    ) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) ||
                (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
                pt.x <
                    ((poly[j].x - poly[i].x) * (pt.y - poly[i].y)) /
                        (poly[j].y - poly[i].y) +
                        poly[i].x &&
                (c = !c);
        return c;
    }

    computeSplitCluster(): any[] {
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

        screenCoords.map((value) => {
            let inside = this.PointInPoly(value, screenCoords);

            if (inside) {
                value["value"] = 1;
            } else {
                value["value"] = 0;
            }
        });
        return screenCoords;
    }
}
