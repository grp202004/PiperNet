import { makeAutoObservable } from "mobx";

export default class PreferencesStore {

    constructor() {
        makeAutoObservable(this);
    }

    rightClickBackgroundPanelOpen = false;
    rightClickNodePanelOpen = false;
    rightClickPositionX = 30;
    rightClickPositionY = 30;

    deleteEdgePanelOpen = false;

    preferenceDialogOpen = false;

    darkMode = true;

    statisticsDialogOpen = false;
    helpDialogOpen = false;
    neighborDialogOpen = false;
    AddNodeDialogOpen = false;
    AddEdgeDialogOpen = false;

    nodeDataSheetDialogOpen = false;
    edgeDataSheetDialogOpen = false;

    isRenderOptionsCardHidden = true;

    view = "3D";
}
