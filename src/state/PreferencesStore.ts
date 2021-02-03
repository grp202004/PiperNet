import { makeAutoObservable } from "mobx";

export default class PreferencesStore {
    constructor() {
        makeAutoObservable(this);
    }

    rightClickNodePanelOpen = false;
    rightClickPositionX = 30;
    rightClickPositionY = 30;

    preferenceDialogOpen = false;

    darkMode = true;

    statisticsDialogOpen = false;
    helpDialogOpen = false;
    neighborDialogOpen = false;
    dataSheetDialogOpen = false;
    dataSheetLoading = true;

    isRenderOptionsCardHidden = true;

    view = "3D";
}
