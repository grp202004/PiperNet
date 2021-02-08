import { makeAutoObservable } from "mobx";

export default class PreferencesStore {
    constructor() {
        makeAutoObservable(this);
    }

    rightClickNodePanelOpen = false;
    rightClickPositionX = 30;
    rightClickPositionY = 30;

    deleteEdgePanelOpen = false;

    preferenceDialogOpen = false;

    darkMode = true;

    statisticsDialogOpen = false;
    helpDialogOpen = false;
    neighborDialogOpen = false;

    nodeDataSheetDialogOpen = false;
    edgeDataSheetDialogOpen = false;

    isRenderOptionsCardHidden = true;

    view = "3D";
}
