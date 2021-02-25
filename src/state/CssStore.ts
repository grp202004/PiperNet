import { autorun, makeAutoObservable } from "mobx";
import State from ".";

/**
 * the configurations to set to cascade the graph
 *
 * @export
 * @class CssStore
 */
export default class CssStore {
    constructor() {
        makeAutoObservable(this);
    }

    config = {
        nodes: {
            colorBy: "pagerank",
            color: {
                scale: "Linear Scale",
                from: "#448AFF",
                to: "#E91E63",
            },
            sizeBy: "pagerank",
            size: {
                min: 2,
                max: 10,
                scale: "Linear Scale",
            },
            labelBy: "node_id",
            shape: "circle",
            labelSize: 1,
            labelLength: 10,
        },
        edges: {
            color: "#7f7f7f",
        },
    };

    clusterForce: number = 20;

    nodeResolution: number = 12;

    isAnimating: boolean = true;

    enableDegree = true;
    enableDensity = true;
    enableDiameter = false;
    enableCoefficient = true;
    enableComponent = true;
}
