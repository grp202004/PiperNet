import { Attributes } from "graphology-types";
import { makeAutoObservable } from "mobx";
import State from ".";

export enum VisualizationMode {
    Normal = "Normal", // normal state
    ClusterSelection = "Cluster Selection", // selecting the cluster to be Merged
    NodeSelection = "Node Selection", // multi-selecting the node
    ClusterSplitting = "Cluster Splitting", // drawing the line to split the cluster
}
export default class InteractionStore {
    constructor() {
        makeAutoObservable(this);
    }

    visualizationMode: VisualizationMode = VisualizationMode.Normal;

    selectedNode: string | null = null;
    /**
     * the currently selected node ids
     * the singleNodeDetailPanel will render and refresh if this changes
     *
     * @type {string[]}
     */
    selectedNodes: string[] = [];

    selectedEdge: string | null = null;

    selectedEdges: string[] = [];

    /**
     * the currently hovered node id
     * the multiNodeDetailPanel will render and refresh if this changes
     *
     * @type {string}
     */
    currentlyHoveredNodeId: string | null = null;

    currentlyHoveredClusterId: string | null = null;

    get currentlyHoveredNodeNeighbors(): string[] | null {
        if (this.currentlyHoveredNodeId === null) {
            return null;
        } else {
            return State.graph.rawGraph.neighbors(this.currentlyHoveredNodeId);
        }
    }

    get currentlyHoveredNodeNeighborEdges(): string[] | null {
        if (this.currentlyHoveredNodeId === null) {
            return null;
        } else {
            return this.getNodeNeighborEdges(this.currentlyHoveredNodeId);
        }
    }

    previouslyHoveredNodeId: string | null = null;

    getNodeNeighborEdges(node: string): string[] {
        let neighbors = State.graph.rawGraph.neighbors(node);
        return neighbors?.map((neighbor: string) => {
            return this.getEdgeKey(
                neighbor,
                this.currentlyHoveredNodeId as string
            ) as string;
        });
    }

    getEdgeKey(node1: string, node2: string): string | null {
        let go: string | undefined = State.graph.rawGraph.edge(node1, node2);
        if (go === undefined) {
            let back: string | undefined = State.graph.rawGraph.edge(
                node2,
                node1
            );
            if (back === undefined) {
                return null;
            } else {
                return back;
            }
        } else {
            return go;
        }
    }

    setNodeToDefault(node: string) {
        this.updateNodeVisualizeAttribute(node, {
            hovered: false,
            selected: false,
        });
    }
    /**
     * update the _visualize object inside node attribute and calls graph refresh
     *
     * @param {string} id
     * @param {Attributes} attribute
     * @memberof GraphMutation
     */
    updateNodeVisualizeAttribute(
        id: string,
        attribute: Attributes,
        oldAttributeVisualize: Attributes | null = null
    ) {
        if (oldAttributeVisualize === null) {
            oldAttributeVisualize = State.graph.rawGraph.getNodeAttribute(
                id,
                "_visualize"
            );
        }

        this.updateVisualizeAttributeParser(
            attribute,
            oldAttributeVisualize as Attributes
        );
    }
    /**
     * update the _visualize object inside edge attribute and calls graph refresh
     *
     * @param {string} id
     * @param {Attributes} attribute
     * @memberof GraphMutation
     */
    updateEdgeVisualizeAttribute(
        key: string,
        attribute: Attributes,
        oldAttributeVisualize: Attributes | null = null
    ) {
        if (oldAttributeVisualize === null) {
            oldAttributeVisualize = State.graph.rawGraph.getEdgeAttribute(
                key,
                "_visualize"
            );
        }
        this.updateVisualizeAttributeParser(
            attribute,
            oldAttributeVisualize as Attributes
        );
    }

    /**
     * update the _visualize object inside all the nodes attribute and calls graph refresh
     *
     * @param {Attributes} _attributeVisualize
     * @memberof GraphMutation
     */
    updateNodesVisualizeAttribute(_attributeVisualize: Attributes) {
        State.graph.rawGraph.updateEachNodeAttributes((node, attribute) => {
            return {
                ...attribute._visualize,
                ..._attributeVisualize,
            };
        });
    }

    /**
     *
     * update the _visualize object inside all the edges attribute and calls graph refresh
     *
     * @param {Attributes} _attributeVisualize
     * @memberof GraphMutation
     */
    updateEdgesVisualizeAttribute(_attributeVisualize: Attributes) {
        State.graph.rawGraph.updateEachEdgeAttributes((node, attribute) => {
            return {
                ...attribute._visualize,
                ..._attributeVisualize,
            };
        });
    }

    updateVisualizeAttributeParser(newAttribute: any, oldAttributes: any) {
        if (newAttribute.hasOwnProperty("hovered")) {
            oldAttributes.hovered = newAttribute.hovered;
        } else if (newAttribute.hasOwnProperty("selected")) {
            oldAttributes.selected = newAttribute.selected;
        }
    }

    /**
     * should call this on every refresh of graph DS
     *
     */
    flush() {
        this.selectedNode = null;
        this.selectedNodes = [];
        this.selectedEdge = null;
        this.selectedEdges = [];
        this.currentlyHoveredNodeId = null;
        this.previouslyHoveredNodeId = null;
    }
}
