import { makeAutoObservable } from "mobx";

export default class HelperStackPanelStore {
    constructor() {
        makeAutoObservable(this);
    }

    // Cluster Splitting

    clusterSplittingPanelStackOpen: boolean = false;

    /**
     *
     * can back to any step, and UI should refresh accordingly
     *
     * @type {(1 | 2 | 3)}
     * @memberof HelperStackPanelStore
     */
    clusterSplittingCurrentStep: 1 | 2 | 3 = 1;

    NodeSelectionPanelOpen: boolean = false;
}
