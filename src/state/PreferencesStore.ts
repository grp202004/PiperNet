import { makeAutoObservable } from "mobx";

export default class PreferencesStore {
    constructor() {
        makeAutoObservable(this);
    }

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
