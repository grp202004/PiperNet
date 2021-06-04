import { autorun, reaction } from "mobx";

import PreferencesStore, { VisualizationMode } from "./PreferencesStore";
import GraphStore from "./GraphStore";
import ImportStore from "./ImportStore";
import SearchStore from "./SearchStore";
import ClusterStore from "./ClusterStore";
import CssStore from "./CssStore";
import GraphDelegate from "./GraphDelegate";
import NodeInteractionStore from "./NodeInteractionStore";
import ClusterInteractionStore from "./ClusterInteractionStore";
import HelperStackPanelStore from "./HelperStackPanelStore";
import SignalStore from "./SignalStore";

/**
 * @description the overall state to store all information of this project
 * use the observable and observer to refresh the React UI
 * @author Zichen XU
 * @class AppState
 */
class AppState {
    static _instance: AppState | null = null;

    preferences!: PreferencesStore;
    graph!: GraphStore;
    graphDelegate!: GraphDelegate;
    interaction!: NodeInteractionStore;
    clusterInteraction!: ClusterInteractionStore;
    import!: ImportStore;
    search!: SearchStore;
    cluster!: ClusterStore;
    helper!: HelperStackPanelStore;
    css!: CssStore;
    signal!: SignalStore;

    private privateConstructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.graphDelegate = new GraphDelegate();
        this.interaction = new NodeInteractionStore();
        this.clusterInteraction = new ClusterInteractionStore();
        this.import = new ImportStore();
        this.search = new SearchStore();
        this.cluster = new ClusterStore();
        this.helper = new HelperStackPanelStore();
        this.css = new CssStore();
        this.signal = new SignalStore();
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

// set the graph to suspend animating according to State.css.isAnimating
autorun(() => {
    if (State.css.isAnimating) {
        State.graphDelegate.graphDelegateMethods?.resumeAnimation();
    } else {
        State.graphDelegate.graphDelegateMethods?.pauseAnimation();
    }
});

// if cluster selected, goto step 2
autorun(() => {
    if (
        State.preferences.visualizationMode ===
        VisualizationMode.ClusterSplitting
    ) {
        if (State.clusterInteraction.chosenCluster) {
            State.helper.clusterSplittingCurrentStep = 2;
            console.log("cluster selected");
        }
    } else {
        State.clusterInteraction.drawPanelActivate = false;
    }
});

// the preparation and cleaning when changing of Step
reaction(
    () => State.helper.clusterSplittingCurrentStep,
    (step) => {
        console.log(`Graph Splitting change to step ${step}`);
        switch (step) {
            case 1:
                State.clusterInteraction.drawPanelActivate = false;
                State.clusterInteraction.confirmClusterSplittingTempData = null;
                State.interaction.flush();
                State.clusterInteraction.flush();
                State.graphDelegate.graphDelegateMethods.refresh();
                break;

            case 2:
                State.clusterInteraction.drawPanelActivate = true;
                State.graph.rawGraph.forEachNode((node, oldAttributes) => {
                    State.interaction.updateNodeVisualizeAttribute(
                        node,
                        { hovered: false, chosen: false, multiSelected: false },
                        oldAttributes._visualize
                    );
                });
                State.clusterInteraction.confirmClusterSplittingTempData = null;
                State.interaction.flush();
                State.graphDelegate.graphDelegateMethods.refresh();
                break;

            case 3:
                State.clusterInteraction.drawPanelActivate = false;
                break;
        }
    }
);

// if graph is empty, suspend the animation to save computing power
reaction(
    () => State.graph.rawGraph?.order,
    (number) => {
        if (number === 0) {
            State.css.isAnimating = false;
            console.log("Pause Animating");
        } else {
            State.css.isAnimating = true;
            console.log("Resume Animating");
        }
    },
    { fireImmediately: true }
);

// auto highlight the hovered Cluster
reaction(
    () => State.clusterInteraction.currentlyHoveredClusterId,
    (currentlyHoveredClusterId) => {
        console.log("currentlyHoveredNodeId", currentlyHoveredClusterId);
        State.graphDelegate.clusterObject.updateAllMaterials();
    }
);

// auto highlight the selected Cluster
reaction(
    () => State.clusterInteraction.chosenCluster,
    () => {
        State.graphDelegate.clusterObject.updateAllMaterials();
    }
);

// auto highlight the selected Clusters
reaction(
    () => State.clusterInteraction.selectedClusters,
    () => {
        State.graphDelegate.clusterObject.updateAllMaterials();
    }
);

// auto color the hovered Node
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
    }
);

// auto color the chosen node (right click on)
reaction(
    () => State.interaction.chosenNode,
    (selectedNode) => {
        console.log("chosenNode", selectedNode);
        State.graph.rawGraph.forEachNode((node, oldAttributes) => {
            if (selectedNode === node) {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { chosen: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateNodeVisualizeAttribute(
                    node,
                    { chosen: false },
                    oldAttributes._visualize
                );
            }
        });
        State.graphDelegate.graphDelegateMethods.refresh();
    }
);

// auto color the selected nodes
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

// auto color the selected edge
reaction(
    () => State.interaction.selectedEdge,
    (selectedEdge) => {
        console.log("selectedEdge", selectedEdge);
        State.graph.rawGraph.forEachEdge((edge, oldAttributes) => {
            if (selectedEdge === edge) {
                State.interaction.updateEdgeVisualizeAttribute(
                    edge,
                    { chosen: true },
                    oldAttributes._visualize
                );
            } else {
                State.interaction.updateEdgeVisualizeAttribute(
                    edge,
                    { chosen: false },
                    oldAttributes._visualize
                );
            }
        });
        State.graphDelegate.graphDelegateMethods.refresh();
    }
);

// auto color the neighbor edges
reaction(
    () => State.interaction.currentlyHoveredNodeId,
    () => {
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

export default State;
