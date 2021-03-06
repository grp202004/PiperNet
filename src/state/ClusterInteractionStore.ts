import { makeAutoObservable } from "mobx";

export default class ClusterInteractionStore {
    constructor() {
        makeAutoObservable(this);
    }
}
