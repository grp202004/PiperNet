import { makeAutoObservable } from "mobx";

/**
 * @description signals for use of ui interaction
 * @author Zichen XU
 * @export
 */
export default class SignalStore {
    constructor() {
        makeAutoObservable(this);
    }

    isRightClickingCluster: boolean = false;

    isMovingCamera: boolean = false;
}
