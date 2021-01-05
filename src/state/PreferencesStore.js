import { observable, action } from "mobx";

export default class PreferencesStore {
    preferenceDialogOpen = false;

    darkMode = true;
    minimapShowing = true;

    statisticsDialogOpen = false;
    helpDialogOpen = false;
    neighborDialogOpen = false;
    dataSheetDialogOpen = false;
}
