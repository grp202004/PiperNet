import { Attributes } from "graphology-types";
import { makeAutoObservable } from "mobx";
import State from ".";
import THREE from "three";
import { Rect } from "_@blueprintjs_table@3.5.0@@blueprintjs/table";
export default class InteractionStore {
    constructor() {
        makeAutoObservable(this);
    }

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
     * when the menuItem 'box-select Node' of RightClickPanel is clicked, then this will be set to true,
     *  and the component'SelectionBox' will be  visualized only the mode is 'Node Selection' and this variable is true
     */
    boxSelectionOpen: boolean = false;
    /**
     * this stores the x and y coordinates when mouse clicked down for box selection
     */
    boxSelection_startPoint: Attributes = {
        x: 0,
        y: 0,
    };

    /**
     * this stores the x and y coordinates when mouse clicked up for box selection
     */
    boxSelection_endPoint: Attributes = {
        x: 0,
        y: 0,
    };

    boxSelectNode() {
        //clear selectedNodes
        State.interaction.selectedNodes = [];

        //calculate the box
        let left = Math.min(
            this.boxSelection_startPoint.x,
            this.boxSelection_endPoint.x
        );
        let top = Math.min(
            this.boxSelection_startPoint.y,
            this.boxSelection_endPoint.y
        );
        let right = Math.max(
            this.boxSelection_startPoint.x,
            this.boxSelection_endPoint.x
        );
        let down = Math.max(
            this.boxSelection_startPoint.y,
            this.boxSelection_endPoint.y
        );

        //check which node is inside the box,if true push them into selectedNodes
        State.graph.rawGraph.forEachNode((node, Attributes) => {
            let coords = State.graphDelegate.graphDelegateMethods.graph2ScreenCoords(
                Attributes._visualize.x,
                Attributes._visualize.y,
                Attributes._visualize.z
            );
            if (
                left <= coords.x &&
                coords.x <= right &&
                top <= coords.y &&
                down >= coords.y
            ) {
                State.interaction.selectedNodes.push(node);
            }
        });
    }

    /**
     * the currently hovered node id
     * the multiNodeDetailPanel will render and refresh if this changes
     *
     * @type {string}
     */
    currentlyHoveredNodeId: string | null = null;

    /**
     * the currently hovered node id that used for display at RightClickPanel
     */
    stagedCurrentlyHoveredNodeId: string = "";

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
        } else if (newAttribute.hasOwnProperty("multiSelected")) {
            oldAttributes.multiSelected = newAttribute.multiSelected;
        }
    }

    // setupSelectionBox(){
    //     let selectionBox=new THREE.Line(Rect,new THREE.LineBasicMaterial({ linewidth: 3, color: 0x999999 }));
    // }

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
