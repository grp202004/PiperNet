import { autorun, runInAction, trace, observable, makeObservable } from "mobx";
import { Intent, Position, Toaster } from "@blueprintjs/core";

import parse from "csv-parse/lib/sync";

import PreferencesStore from "./PreferencesStore";
import GraphStore from "./GraphStore";
import ImportStore from "./ImportStore";
import ProjectStore from "./ProjectStore";
import SearchStore from "./SearchStore";

class AppState {
    constructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.import = new ImportStore();
        this.search = new SearchStore();
        this.project = new ProjectStore();
    }
}

const State = new AppState();
window.state = State;

// extract CSV from selected edge File object and update related fields.
// will auto run if selectedEdgeFileFromInput or delimiter or anything is changed.
autorun(() => State.import.renderImportEdgePreview());

// extract CSV from selected node File object and update related fields.
// will auto run if selectedNodeFileFromInput or delimiter or anything is changed.
autorun(() => State.import.renderImportNodePreview());

export default State;
