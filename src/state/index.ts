import { autorun, runInAction, observable, makeObservable } from "mobx";

import PreferencesStore from "./PreferencesStore";
import GraphStore from "./GraphStore";
import ImportStore from "./ImportStore";
import ProjectStore from "./ProjectStore";
import SearchStore from "./SearchStore";
import ClusterStore from "./ClusterStore";
import CssStore from "./CssStore";

class AppState {
    constructor() {}

    static _instance: AppState | null = null;

    preferences!: PreferencesStore;
    graph!: GraphStore;
    import!: ImportStore;
    search!: SearchStore;
    project!: ProjectStore;
    cluster!: ClusterStore;
    css!: CssStore;

    private privateConstructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.import = new ImportStore();
        this.search = new SearchStore();
        this.project = new ProjectStore();
        this.cluster = new ClusterStore();
        this.css = new CssStore();
    }

    // add singleton to prevent creating multiple instances of the State class
    static get instance() {
        if (AppState._instance === null) {
            let instance = new AppState();
            instance.privateConstructor();
            AppState._instance = instance;
            return instance;
        } else {
            return AppState._instance;
        }
    }
}

const State = AppState.instance;

// extract CSV from selected edge File object and update related fields.
// will auto run if selectedEdgeFileFromInput or delimiter or anything is changed.
autorun(() => State.import.renderImportEdgePreview());

// extract CSV from selected node File object and update related fields.
// will auto run if selectedNodeFileFromInput or delimiter or anything is changed.
autorun(() => State.import.renderImportNodePreview());

autorun(() => (State.cluster.rawGraph = State.graph.rawGraph));

export default State;
