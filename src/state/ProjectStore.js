import { observable } from "mobx";

export default class ProjectStore {
    @observable currentSnapshotName = "Untitled";

    @observable saveSnapshotDialogOpen = false;
    @observable renameSnapshotDialogOpen = false;
}
