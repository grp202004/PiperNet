import { observable } from "mobx";

export default class SearchStore {
    @observable searchPaneOpen = false;

    @observable searchStr = "";
    @observable candidates = [];
    @observable numCandidates = 0;
}
