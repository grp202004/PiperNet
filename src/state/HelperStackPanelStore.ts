import { makeAutoObservable } from "mobx";

/**
 * @description you may notice that when selecting different VisualizationMode
 * a popover which contains either simple configs or helper messages will pop up
 * this class stores the necessary information to make that happen
 * @author Zichen XU
 * @export
 * @class HelperStackPanelStore
 */
export default class HelperStackPanelStore {
    constructor() {
        makeAutoObservable(this);
    }

    // Cluster Splitting

    /**
     * @description if the clusterSplittingPanelStackOpen is open
     * @author Zichen XU
     * @type {boolean}
     */
    clusterSplittingPanelStackOpen: boolean = false;

    /**
     * @description can back to any step, and UI should refresh accordingly
     *
     * @author Zichen XU
     * @type {(1 | 2 | 3)}
     */
    clusterSplittingCurrentStep: 1 | 2 | 3 = 1;

    /**
     * @description if the NodeSelectionPanelOpen is open
     * @author Zichen XU
     * @type {boolean}
     */
    NodeSelectionPanelOpen: boolean = false;
}
