import { observable, action, makeObservable } from "mobx";

export default class PreferencesStore {
    preferenceDialogOpen = false;

    darkMode = true;

    statisticsDialogOpen = false;
    helpDialogOpen = false;
    neighborDialogOpen = false;
    dataSheetDialogOpen = false;

    constructor() {
        makeObservable(this, {
            preferenceDialogOpen: observable,
            darkMode: observable,
            statisticsDialogOpen: observable,
            helpDialogOpen: observable,
            neighborDialogOpen: observable,
            dataSheetDialogOpen: observable,
        });
    }
}
