import { makeAutoObservable } from "mobx";

export default class ProjectStore {
    constructor() {
        makeAutoObservable(this);
    }

    currentSnapshotName = "Untitled";

    saveSnapshotDialogOpen = false;
    renameSnapshotDialogOpen = false;
}
