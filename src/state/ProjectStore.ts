import { makeAutoObservable } from "mobx";

export default class ProjectStore {
    currentSnapshotName = "Untitled";

    saveSnapshotDialogOpen = false;
    renameSnapshotDialogOpen = false;

    constructor() {
        makeAutoObservable(this);
    }
}
