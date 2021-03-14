import { makeAutoObservable } from "mobx";

export enum VisualizationMode {
    Normal = "Normal", // normal state
    ClusterSelection = "Cluster Selection", // selecting the cluster to be Merged
    NodeSelection = "Node Selection", // multi-selecting the node
    ClusterSplitting = "Cluster Splitting", // drawing the line to split the cluster
}

export default class PreferencesStore {
    constructor() {
        makeAutoObservable(this);
    }

    // Right Click Position

    rightClickPositionX = 30;
    rightClickPositionY = 30;

    // Dialog
    exportDialogOpen = false;
    preferenceDialogOpen = false;
    statisticsDialogOpen = false;

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

    view = "3D";
    controlType: "trackball" | "orbit" | "fly" = "trackball";

    visualizationMode: VisualizationMode = VisualizationMode.Normal;
}
