import { autorun, makeAutoObservable } from "mobx";
class NodeConfig {
    constructor() {
        makeAutoObservable(this);
    }

    defaultColor: string = "#808080";
    selectedColor: string = "#ffff00";
    highlightColor: string = "#ff0000";

    size = 4;
    resolution = 12;
}

class EdgeConfig {
    constructor() {
        makeAutoObservable(this);
    }

    defaultColor: string = "#ffffff";
    selectedColor: string = "#ffff00";
    highlightColor: string = "#ff0000";

    resolution = 6;
    width = 1;
    opacity = 0.2;
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
        this.node = new NodeConfig();
        this.edge = new EdgeConfig();
        this.label = new LabelConfig();
        this.cluster = new ClusterConfig();
    }

    node!: NodeConfig;

    edge!: EdgeConfig;

    label!: LabelConfig;

    cluster!: ClusterConfig;

    isAnimating: boolean = true;
}
