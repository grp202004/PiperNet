import { observable, action } from "mobx";

export default class PreferencesStore {
    @observable preferenceDialogOpen = false;

    @observable darkMode = true;
    @observable minimapShowing = true;

    @observable statisticsDialogOpen = false;
    @observable helpDialogOpen = false;
    @observable neighborDialogOpen = false;
    @observable dataSheetDialogOpen = false;
}
