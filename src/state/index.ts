import { autorun } from "mobx";

import PreferencesStore from "./PreferencesStore";
import GraphStore from "./GraphStore";
import ImportStore from "./ImportStore";
import ProjectStore from "./ProjectStore";
import SearchStore from "./SearchStore";
import ClusterStore from "./ClusterStore";
import CssStore from "./CssStore";
import GraphDelegate from "./GraphDelegate";

class AppState {
    static _instance: AppState | null = null;

    preferences!: PreferencesStore;
    graph!: GraphStore;
    graphDelegate!: GraphDelegate;
    import!: ImportStore;
    search!: SearchStore;
    project!: ProjectStore;
    cluster!: ClusterStore;
    css!: CssStore;

    private privateConstructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.graphDelegate = new GraphDelegate();
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

// this is for easily debugging in runtime
//@ts-ignore
window._state = State;

// extract CSV from selected edge File object and update related fields.
// will auto run if selectedEdgeFileFromInput or delimiter or anything is changed.
autorun(() => State.import.renderImportEdgePreview());

// extract CSV from selected node File object and update related fields.
// will auto run if selectedNodeFileFromInput or delimiter or anything is changed.
autorun(() => State.import.renderImportNodePreview());

autorun(
    () =>
        (State.cluster.rawGraph = State.search.rawGraph = State.graph.rawGraph)
);

export default State;
