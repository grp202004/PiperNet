import { observable } from "mobx";

export default class ProjectStore {
    currentSnapshotName = "Untitled";

    saveSnapshotDialogOpen = false;
    renameSnapshotDialogOpen = false;
}
