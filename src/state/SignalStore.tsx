import { makeAutoObservable } from "mobx";

/**
 * @description this file is the backend support for the NodeSearch feature
 * and will compute the possible searching candidates according to the query parameters
 * @author Zichen XU
 * @export
 * @class SearchStore
 */
export default class SignalStore {
    constructor() {
        makeAutoObservable(this);
    }

    isRightClickingCluster: boolean = false;

    setIsRightClickingCluster() {
        this.isRightClickingCluster = true;
        setTimeout(() => (this.isRightClickingCluster = false), 500);
    }
}
