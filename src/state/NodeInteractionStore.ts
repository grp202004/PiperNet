import { Attributes } from "graphology-types";
import { makeAutoObservable } from "mobx";
import State from ".";
import { NAVBAR_HEIGHT } from "../constants";
import { ICustomLinkObject, ICustomNodeObject } from "./GraphDelegate";
export default class InteractionStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * @description the currently selected node
     * represents the node being right-clicked on
     * @author Zhiyuan LYU
     * @type {(string | null)}
     */
    chosenNode: string | null = null;

    /**
     * @description the currently selected nodes id
     * the singleNodeDetailPanel will render and refresh if this changes
     * used in NodeSelection panel to do actions on those selected nodes
     * @author Zhiyuan LYU
     * @type {string[]}
     */
    selectedNodes: string[] = [];

    /**
     * @description the currently selected edge id
     * @author Zhiyuan LYU
     * @type {(string | null)}
     */
    selectedEdge: string | null = null;

    /**
     * @description when the menuItem 'box-select Node' of RightClickPanel is clicked, then this will be set to true,
     *  and the component 'SelectionBox' will be  visualized only the mode is 'Node Selection' and this variable is true
     * @author Zhiyuan LYU
     * @type {boolean}
     */
    boxSelectionOpen: boolean = false;

    /**
     * @description this stores the x and y coordinates when mouse clicked down for box selection
     * @author Zhiyuan LYU
     * @type {Attributes}
     */
    boxSelection_startPoint: Attributes = {
        x: 0,
        y: 0,
    };

    /**
     * @description this stores the x and y coordinates when mouse clicked up for box selection
     * @author Zhiyuan LYU
     * @type {Attributes}
     */
    boxSelection_endPoint: Attributes = {
        x: 0,
        y: 0,
    };

    /**
     * @description compute the selected node within this selection box
     * @author Zhiyuan LYU
     */
    boxSelectNode() {
        //clear selectedNodes
        State.interaction.selectedNodes = [];

        //calculate the box
        let left = Math.min(
            this.boxSelection_startPoint.x,
            this.boxSelection_endPoint.x
        );
        let top =
            Math.min(
                this.boxSelection_startPoint.y,
                this.boxSelection_endPoint.y
            ) - NAVBAR_HEIGHT;
        let right = Math.max(
            this.boxSelection_startPoint.x,
            this.boxSelection_endPoint.x
        );
        let down =
            Math.max(
                this.boxSelection_startPoint.y,
                this.boxSelection_endPoint.y
            ) - NAVBAR_HEIGHT;

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
     * @description the currently hovered node id
     * the multiNodeDetailPanel will render and refresh if this changes
     * @author Zhiyuan LYU
     * @type {(string | null)}
     */
    currentlyHoveredNodeId: string | null = null;

    /**
     * @description compute the neighbors of the currently hovered node id
     * @author Zichen XU
     * @readonly
     * @type {(string[] | null)}
     */
    get currentlyHoveredNodeNeighborEdges(): string[] | null {
        if (this.currentlyHoveredNodeId === null) {
            return null;
        } else {
            let neighbors = State.graph.rawGraph.neighbors(
                this.currentlyHoveredNodeId
            );
            return neighbors?.map((neighbor: string) => {
                return this.getEdgeKey(
                    neighbor,
                    this.currentlyHoveredNodeId as string
                ) as string;
            });
        }
    }

    /**
     * @description get the key of the edge with source and target bidirectional
     * @author Zhiyuan LYU
     * @param {string} node1
     * @param {string} node2
     * @returns {*}  {(string | null)}
     */
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

    /**
     * @description update the _visualize object inside node attribute and calls graph refresh
     * @author Zichen XU
     * @param {string} id
     * @param {Attributes} attribute
     * @param {(Attributes | null)} [oldAttributeVisualize=null]
     */
    updateNodeVisualizeAttribute(
        id: string,
        attribute: Partial<ICustomNodeObject>,
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
     * @description update the _visualize object inside edge attribute and calls graph refresh
     * @author Zichen XU
     * @param {string} key
     * @param {Attributes} attribute
     * @param {(Attributes | null)} [oldAttributeVisualize=null]
     */
    updateEdgeVisualizeAttribute(
        key: string,
        attribute: Partial<ICustomLinkObject>,
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
     * @description helper method to call by updateEdgeVisualizeAttribute and updateNodeVisualizeAttribute
     * @author Zichen XU
     * @private
     * @param {*} newAttribute
     * @param {*} oldAttributes
     */
    private updateVisualizeAttributeParser(
        newAttribute: any,
        oldAttributes: any
    ) {
        if (newAttribute.hasOwnProperty("hovered")) {
            oldAttributes.hovered = newAttribute.hovered;
        } else if (newAttribute.hasOwnProperty("chosen")) {
            oldAttributes.chosen = newAttribute.chosen;
        } else if (newAttribute.hasOwnProperty("multiSelected")) {
            oldAttributes.multiSelected = newAttribute.multiSelected;
        }
    }

    /**
     * @description should call this on every refresh of graph DS
     * or simply change the InteractionMode
     * @author Zichen XU
     */
    flush() {
        this.chosenNode = null;
        this.selectedNodes = [];
        this.selectedEdge = null;
        this.currentlyHoveredNodeId = null;
    }
}
