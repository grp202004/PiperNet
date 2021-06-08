import { makeAutoObservable } from "mobx";

/**
 * @description the global configurations for the css of all nodes
 * @author Zichen XU
 * @class NodeGlobalConfig
 */
class NodeGlobalConfig {
    constructor() {
        makeAutoObservable(this);
    }
    defaultColor: string = "#808080";
    chosenColor: string = "#ffffAA";
    multiSelectedColor: string = "#ffffff";
    highlightColor: string = "#ff6060";

    resolution = 12;

    size = 4;
}

/**
 * @description the global configurations for the css of all edges
 * @author Zichen XU
 * @class EdgeGlobalConfig
 */
class EdgeGlobalConfig {
    constructor() {
        makeAutoObservable(this);
    }

    defaultColor = "#ffffff";
    selectedColor = "#ffff00";
    highlightColor = "#ff8E8E";

    defaultWidth: number = 1;

    highlightWidth: number = 2;

    resolution = 6;
}
/**
 * @description the global configurations for the css of all labels
 * @author Zichen XU
 * @class LabelConfig
 */
class LabelConfig {
    constructor() {
        makeAutoObservable(this);
    }

    show = true;
    color = "#d3d3d3";
    size = 4;
}
/**
 * @description the global configurations for the css of all clusters
 * @author Zichen XU
 * @class ClusterConfig
 */
class ClusterConfig {
    constructor() {
        makeAutoObservable(this);
    }

    autoPlot = false;
    clusterForce = 30;
    normalForce = 50;
    resolution = 10;
    shape: "convexHull" | "sphere" = "sphere";
}

/**
 * @description as the name indicates, it stores the customized style of Nodes/Edges/Label/Clusters
 * and any change on it should then call State.graphDelegate.graphDelegateMethods.refresh() to apply changes
 * @author Zichen XU, Zhiyuan LYU
 * @export
 * @class CssStore
 */
export default class CssStore {
    constructor() {
        makeAutoObservable(this);
        this.node = new NodeGlobalConfig();
        this.edge = new EdgeGlobalConfig();
        this.label = new LabelConfig();
        this.cluster = new ClusterConfig();
    }

    node!: NodeGlobalConfig;

    edge!: EdgeGlobalConfig;

    label!: LabelConfig;

    cluster!: ClusterConfig;

    isAnimating: boolean = true;
}
