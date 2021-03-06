import { makeAutoObservable } from "mobx";

export default class ClusterInteractionStore {
    constructor() {
        makeAutoObservable(this);
    }
    currentlyHoveredClusterId: string | null = null;

    selectedClusters: string[] = [];

    mergeSelectedCluster() {}
}
