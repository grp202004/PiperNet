import { makeAutoObservable } from "mobx";

/**
 * @description the four interaction modes
 * @author Zichen XU, Zhiyuan LYU
 * @export
 * @enum {number}
 */
export enum VisualizationMode {
    Normal = "Normal", // normal state
    ClusterSelection = "Cluster Selection", // selecting the cluster to be Merged
    NodeSelection = "Node Selection", // multi-selecting the node
    ClusterSplitting = "Cluster Splitting", // drawing the line to split the cluster
}

/**
 * @description it controls the open/close of dialogs/panels
 * and the VisualizationMode(Normal/NodeSelection/ClusterSelection/ClusterSplitting) as well
 * @author Zichen XU
 * @export
 * @class PreferencesStore
 */
export default class PreferencesStore {
    constructor() {
        makeAutoObservable(this);
    }

    // Right Click Position

    rightClickPositionX = 30;
    rightClickPositionY = 30;

    // Dialog

    exportDialogOpen = false;
    private preferenceDialogOpen = false;
    private statisticsDialogOpen = false;

    AddNodeDialogOpen = false;
    AddEdgeDialogOpen = false;

    nodeDataSheetDialogOpen = false;
    edgeDataSheetDialogOpen = false;

    // Panel

    rightClickOn = null as null | "Node" | "Cluster" | "Background";
    rightClickPanelOpen = false;
    deleteEdgePanelOpen = false;

    graphOptionsCardOpen = false;

    closeAllPanel(except?: string) {
        this.deleteEdgePanelOpen = false;
        this.graphOptionsCardOpen = false;
        if (except !== "rightClickPanel") {
            this.rightClickPanelOpen = false;
        }
    }

    // 3D Graph

    visualizationMode: VisualizationMode = VisualizationMode.Normal;
}
