import { observable, action } from "mobx";
import { IS_IFRAME_WIDGET } from "../constants";

export default class PreferencesStore {
    @observable preferenceDialogOpen = false;

    @observable openSnapshotDialogOpen = false;
    @observable statisticsDialogOpen = false;
    @observable helpDialogOpen = false;
    @observable neighborDialogOpen = false;
    @observable dataSheetDialogOpen = false;

    @observable darkMode = true;
    @observable minimapShowing = true;
}
