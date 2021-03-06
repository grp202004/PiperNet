import { makeAutoObservable } from "mobx";

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
    helpDialogOpen = false;

    AddNodeDialogOpen = false;
    AddEdgeDialogOpen = false;

    nodeDataSheetDialogOpen = false;
    edgeDataSheetDialogOpen = false;

    // Panel

    rightClickOn = null as null | "Node" | "Cluster" | "Background";
    rightClickPanelOpen = false;
    deleteEdgePanelOpen = false;

    isGraphOptionsCardHidden = true;

    // 3D Graph

    view = "3D";
    controlType: "trackball" | "orbit" | "fly" = "trackball";
}
