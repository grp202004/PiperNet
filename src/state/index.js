export class AppState {
    constructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.import = new ImportStore();
        this.search = new SearchStore();
        this.project = new ProjectStore();
    }
}

const state = new AppState();
window.state = state;
