import { makeAutoObservable } from "mobx";

export default class SearchStore {
    constructor() {
        makeAutoObservable(this);
    }

    searchPaneOpen = false;

    searchStr = "";
    candidates = [];
    numCandidates = 0;
    panelOpen = true; //test for ui panels
}
