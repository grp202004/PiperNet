import { autorun, reaction } from "mobx";

import PreferencesStore from "./PreferencesStore";
import GraphStore from "./GraphStore";
import ImportStore from "./ImportStore";
import ProjectStore from "./ProjectStore";
import SearchStore from "./SearchStore";
import ClusterStore from "./ClusterStore";
import CssStore from "./CssStore";
import GraphDelegate from "./GraphDelegate";
import InteractionStore from "./InteractionStore";

class AppState {
    static _instance: AppState | null = null;

    preferences!: PreferencesStore;
    graph!: GraphStore;
    graphDelegate!: GraphDelegate;
    interaction!: InteractionStore;
    import!: ImportStore;
    search!: SearchStore;
    project!: ProjectStore;
    cluster!: ClusterStore;
    css!: CssStore;

    private privateConstructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.graphDelegate = new GraphDelegate();
        this.interaction = new InteractionStore();
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

autorun(() => {
    if (State.css.isAnimating === true) {
        State.graphDelegate.graphDelegateMethods?.resumeAnimation();
    } else {
        State.graphDelegate.graphDelegateMethods?.pauseAnimation();
    }
});

reaction(
    () => State.interaction.currentlyHoveredNodeId,
    (currentlyHoveredNodeId) => {
        console.log("currentlyHoveredNodeId", currentlyHoveredNodeId);
        State.graph.rawGraph.forEachNode((node, oldAttributes) => {
            if (node === currentlyHoveredNodeId) {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { hovered: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { hovered: false },
                    oldAttributes._visualize
                );
            }
        });
        State.graph.rawGraph.forEachEdge((edge, oldAttributes) => {
            if (
                State.interaction.currentlyHoveredNodeNeighborEdges?.includes(
                    edge
                )
            ) {
                State.interaction.updateEdgeVisualizeAttribute(
                    edge,
                    { hovered: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateEdgeVisualizeAttribute(
                    edge,
                    { hovered: false },
                    oldAttributes._visualize
                );
            }
        });
        State.graphDelegate.graphDelegateMethods.refresh();
    }
);

reaction(
    () => State.interaction.selectedNodes.map((node) => node),
    (selectedNodes) => {
        console.log("selectedNodes", selectedNodes);
        State.graph.rawGraph.forEachNode((node, oldAttributes) => {
            if (selectedNodes.includes(node)) {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { multiSelected: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { multiSelected: false },
                    oldAttributes._visualize
                );
            }
        });

        State.graphDelegate.graphDelegateMethods.refresh();
    }
);

reaction(
    () => State.interaction.selectedNode,
    (selectedNode) => {
        console.log("selectedNode", selectedNode);
        State.graph.rawGraph.forEachNode((node, oldAttributes) => {
            if (selectedNode === node) {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { selected: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { selected: false },
                    oldAttributes._visualize
                );
            }
        });
        State.graphDelegate.graphDelegateMethods.refresh();
    }
);

reaction(
    () => State.interaction.selectedEdge,
    (selectedEdge) => {
        console.log("selectedEdge", selectedEdge);
        State.graph.rawGraph.forEachEdge((edge, oldAttributes) => {
            if (selectedEdge === edge) {
                State.interaction.updateEdgeVisualizeAttribute(
                    edge,
                    { selected: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateEdgeVisualizeAttribute(
                    edge,
                    { selected: false },
                    oldAttributes._visualize
                );
            }
        });
        State.graphDelegate.graphDelegateMethods.refresh();
    }
);

export default State;
