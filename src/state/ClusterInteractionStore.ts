import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { polygonContains } from "d3-polygon";
import State from ".";

export enum DrawMode {
    StraightLine,
    FreeLine,
    FreeCircle,
    CenterCircle,
}

/**
 * @description the cluster-mouse-interaction related filed and functions are hereby written in this class
 * such as `currentlyHoveredClusterId`, `selectedCluster` and `selectedClusters`,
 * these selection should be `flush()` after using(or before entering another interaction mode)
 * the callback functions of mouse events are presented as well to handle events like hover/left/rightClick.
 * There are also helper methods to deal with features like mergeCluster and SplitCluster.
 *
 * In the cluster splitting procedure, after user draw a curved link,
 * the segment of that line will be stored in the `lineSegment` and `computeSplitCluster` will be called to compute the two stack of split nodes,
 * the result will be stored inside `confirmClusterSplittingTempData` waiting for the final `splitCluster()` function to confirm this operation
 * @author Zichen XU
 * @export
 * @class ClusterInteractionStore
 *
 */
export default class ClusterInteractionStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * @description the cluster UUID (assigned by THREE.js) of the hovered cluster
     * @author Zichen XU
     * @type {(string | null)}
     */

    currentlyHoveredClusterId: string | null = null;

    /**
     * @description the selected Cluster UUID used in choosing which cluster to be split
     * @author Zichen XU
     * @type {(string | null)}
     */
    chosenCluster: string | null = null;

    /**
     * @description the selected Clusters UUID used in choosing which clusters to be merged
     * @author Zichen XU
     * @type {string[]}
     */
    selectedClusters: string[] = [];

    /**
     * @description flush the above fields in situations like switching VisualizationMode
     * re-import or after graph mutation
     * @author Zichen XU
     */
    flush() {
        this.currentlyHoveredClusterId = null;
        this.chosenCluster = null;
        this.selectedClusters = [];
    }

    /**
     * @description this will only be active in the ClusterSelection and ClusterSplit
     * it will set the selectedCluster and add/remove this cluster in the selectedClusters list
     * @author Zichen XU
     * @param {string} uuid uuid of the custer on left-click
     * @param {MouseEvent} event
     */
    clusterLeftClickCallback(uuid: string, event: MouseEvent) {
        State.graphDelegate.clusterObject.meshSpotlightMaterial(
            State.graphDelegate.clusterObject.getObjectById(uuid) as THREE.Mesh
        );
        // multi-selection
        let index;

        State.clusterInteraction.chosenCluster = uuid;

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

    /**
     * @description this will only be active in the ClusterSelection and ClusterSplit
     * it will set the currentlyHoveredClusterId to this cluster
     * @author Zichen XU
     * @param {(string | null)} uuid of the custer on mouse hover
     * @param {MouseEvent} event
     */
    clusterHoverCallback(uuid: string | null, event: MouseEvent) {
        State.clusterInteraction.currentlyHoveredClusterId = uuid;
    }

    /**
     * @description this will only be active in the ClusterSelection
     * it will set the selectedCluster to this cluster and open the rightClickPanel
     * @author Zichen XU
     * @param {(string | null)} uuid of the custer on mouse hover
     * @param {MouseEvent} event
     */
    clusterRightClickCallback(uuid: string | null, event: MouseEvent) {
        State.signal.setIsRightClickingCluster();

        State.clusterInteraction.chosenCluster = uuid;
        State.preferences.rightClickPositionX = event.x;
        State.preferences.rightClickPositionY = event.y;
        // if selected cluster is not in the list, then add
        if (uuid) {
            if (!this.selectedClusters.includes(uuid)) {
                this.selectedClusters.push(uuid);
            }
            State.preferences.rightClickOn = "Cluster";
        } else {
            State.preferences.rightClickOn = "Background";
        }
        State.preferences.rightClickPanelOpen = true;
        State.preferences.closeAllPanel("rightClickPanel");
    }

    /**
     * @description loop through the selected clusters and set the nodes within that cluster
     * @author Zichen XU
     */
    releaseSelectedClusters() {
        if (
            this.selectedClusters.length === 0 &&
            this.currentlyHoveredClusterId
        ) {
            this.selectedClusters.push(this.currentlyHoveredClusterId);
        }
        this.selectedClusters.forEach((uuid) => {
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
        this.flush();
    }

    /* --------------- The below content is for cluster splitting --------------- */

    /**
     * @description whether the drawing panel used in ClusterSplit is active
     * @author Zichen XU
     * @type {boolean}
     */
    drawPanelActivate: boolean = false;

    /**
     * @description whether to draw a straight line or a curved line when clustering
     *
     * @author Zichen XU
     * @type {boolean}
     */
    drawMode: DrawMode = DrawMode.FreeLine;

    /**
     * @description the line segments returned by drawing a line
     * it has the left/right-top points as well to form a polygon
     * @author Zichen XU
     * @type {any[]}
     */
    lineSegment!: any[];

    /**
     * @description the temp data returned by splitting the cluster
     * the value attribute is either 0 or 1 to form two clusters
     * this data is saved to preview the split to user and wait for final confirmation
     * @author Zichen XU
     * @type {({
     *               value: number;
     *               id: string;
     *               x: number;
     *               y: number;
     *           }[]
     *         | null)}
     */
    confirmClusterSplittingTempData:
        | {
              value: number;
              id: string;
              x: number;
              y: number;
          }[]
        | null = null;

    /**
     * @description compute the clusterSplittingTempData based on the lineSegment data
     * using the polygonContains to determine which node is in selection
     * the value attribute is either 0 or 1 to form two clusters
     * this data is saved to preview the split to user and wait for final confirmation
     * @author Zichen XU
     */
    computeSplitCluster() {
        let screenCoords = [] as {
            id: string;
            x: number;
            y: number;
            value: number;
        }[];
        const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
            State.clusterInteraction.chosenCluster as string
        );
        let keys = State.cluster.attributeKeys.get(clusterValue!) as string[];
        keys.forEach((node) => {
            let attribute = State.graph.rawGraph.getNodeAttributes(node);
            let coord = State.graphDelegate.graphDelegateMethods.graph2ScreenCoords(
                attribute._visualize.x,
                attribute._visualize.y,
                attribute._visualize.z
            );
            screenCoords.push({ id: node, x: coord.x, y: coord.y, value: 0 });
        });

        let tempLineSegment: [number, number][] = this.lineSegment.map(
            (value) => {
                return [value.x, value.y];
            }
        );

        screenCoords.forEach((point) => {
            let inside = polygonContains(tempLineSegment, [point.x, point.y]);

            if (inside) {
                State.interaction.updateNodeVisualizeAttribute(point.id, {
                    hovered: true,
                });
                point.value = 1;
            } else {
                State.interaction.updateNodeVisualizeAttribute(point.id, {
                    hovered: false,
                });
                point.value = 0;
            }
        });

        State.graphDelegate.graphDelegateMethods.refresh();
        this.confirmClusterSplittingTempData = screenCoords;
    }

    computeSplitClusterInCircle(
        centerX: number,
        centerY: number,
        radius: number
    ) {
        let screenCoords = [] as {
            id: string;
            x: number;
            y: number;
            value: number;
        }[];
        const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
            State.clusterInteraction.chosenCluster as string
        );
        let keys = State.cluster.attributeKeys.get(clusterValue!) as string[];
        keys.forEach((node) => {
            let attribute = State.graph.rawGraph.getNodeAttributes(node);
            let coord = State.graphDelegate.graphDelegateMethods.graph2ScreenCoords(
                attribute._visualize.x,
                attribute._visualize.y,
                attribute._visualize.z
            );
            screenCoords.push({ id: node, x: coord.x, y: coord.y, value: 0 });
        });

        screenCoords.forEach((point) => {
            let distance = Math.sqrt(
                Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
            );

            if (distance < radius) {
                // in the drawn area
                State.interaction.updateNodeVisualizeAttribute(point.id, {
                    hovered: true,
                });
                point.value = 1;
            } else {
                State.interaction.updateNodeVisualizeAttribute(point.id, {
                    hovered: false,
                });
                point.value = 0;
            }
        });

        State.graphDelegate.graphDelegateMethods.refresh();
        this.confirmClusterSplittingTempData = screenCoords;
    }

    /**
     * @description this will be called when user confirm the cluster split
     * it will set the attribute of these two groups to be different
     * and clear the tempData
     * @author Zichen XU
     */
    splitCluster(
        attribute: string,
        valueInWhite: number | string,
        valueInRed: number | string
    ) {
        const clusterValue = State.graphDelegate.clusterObject.UUID2ClusterValueMap.get(
            this.chosenCluster as string
        ) as string | number;
        const nodesToAlter = State.cluster.attributeKeys.get(
            clusterValue
        ) as string[];
        this.confirmClusterSplittingTempData?.forEach((node) => {
            if (nodesToAlter.includes(node.id)) {
                State.graph.rawGraph.setNodeAttribute(
                    node.id,
                    attribute,
                    node.value === 1 ? valueInRed : valueInWhite
                );
            }
        });
        this.confirmClusterSplittingTempData = null;
        State.cluster.setCluster(attribute, true);
    }
}
