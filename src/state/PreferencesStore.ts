import { makeAutoObservable } from "mobx";

export default class PreferencesStore {
    preferenceDialogOpen = false;

    darkMode = true;

    statisticsDialogOpen = false;
    helpDialogOpen = false;
    neighborDialogOpen = false;
    dataSheetDialogOpen = false;

    isRenderOptionsCardHidden = true;

    view = "3D";

    constructor() {
        makeAutoObservable(this);
    }
}
