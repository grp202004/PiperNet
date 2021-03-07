import { makeAutoObservable } from "mobx";

/**
 * changing the config inside .global will cause to change every config of every node iteratively
 *
 * but changing the else does not
 *
 * @class NodeGlobalConfig
 */
class NodeGlobalConfig {
    constructor() {
        makeAutoObservable(this);
    }
    defaultColor: string = "#808080";
    selectedColor: string = "#ffffAA";
    highlightColor: string = "#ff6060";

    resolution = 12;

    size = 4;
}

/**
 * changing the config inside .global will cause to change every config of every edge iteratively
 *
 * but changing the else does not
 *
 * @class EdgeGlobalConfig
 */ class EdgeGlobalConfig {
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
class LabelConfig {
    constructor() {
        makeAutoObservable(this);
    }

    show = true;
    color = "#d3d3d3";
    size = 4;
}

class ClusterConfig {
    constructor() {
        makeAutoObservable(this);
    }

    clusterForce = 20;
    normalForce = 50;
    resolution = 10;
    shape: "convexHull" | "sphere" = "convexHull";
}
/**
 * the configurations to set to cascade the graph
 *
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
