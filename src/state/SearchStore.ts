import { makeAutoObservable } from "mobx";

export default class SearchStore {
    searchPaneOpen = false;

    searchStr = "";
    candidates = [];
    numCandidates = 0;
    panelOpen = true; //test for ui panels

    constructor() {
        makeAutoObservable(this);
    }
}
