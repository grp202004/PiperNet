import { makeAutoObservable } from "mobx";

export default class ProjectStore {
    constructor() {
        makeAutoObservable(this);
    }

    currentSnapshotName = "Untitled";

    exportDialogOpen = false;
    renameSnapshotDialogOpen = false;
}
