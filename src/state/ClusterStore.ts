import { makeAutoObservable, observable } from "mobx";
import Graph from "graphology";
import * as THREE from "three";
import randomcolor from "randomcolor";
import State from ".";

/**
 * all the computed values get from the rawGraph
 *
 * @export
 * @class ClusterStore
 */
export default class ClusterStore {
    constructor() {
        makeAutoObservable(this, {
            rawGraph: observable.ref,
        });
    }
    /**
     * @observable
     *
     * attention: please use setCluster() to alter this data
     * Specify which attribute to be clustered
     * the default value should be null, and front-end graph will interpret this to Not-Cluster
     *
     *
     */
    clusterBy: string | null = null;

    /**
     * the setter of clusterBy
     * will update the front-end 3d graph about the cluster changes
     *
     * @param {(string | null)} by
     */
    setCluster(by: string | null) {
        this.clusterBy = by;
        State.graph.rawGraph.setAttribute("default", by);
        State.graph.refreshGraph();
    }

    /**
     * @observable .ref
     * the reference bounded to the GraphStore/rawGraph
     *
     * @type {Graph}
     */
    rawGraph!: Graph;

    /**
     * @computed
     * a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the id of a Node -> the value of the attribute specified by $clusterBy]
     *
     * @readonly
     * @type {(Map<string, string | number>)}
     */
    get keyAttribute(): Map<string, string | number> {
        const keyValueMap = new Map<string, string | number>();
        if (this.clusterBy === null) {
            return keyValueMap;
        }
        const attribute = this.clusterBy as string;

        this.rawGraph?.forEachNode((key, attributes) => {
            // if this attribute is defined
            if (attributes.hasOwnProperty(attribute)) {
                keyValueMap.set(key, attributes[attribute]);
            } else {
                // this attribute is undefined in this node
                keyValueMap.set(key, "undefined");
            }
        });
        return keyValueMap;
    }

    /**
     * the possible attribute values of the attribute defined by $clusterBy
     *
     * @readonly
     * @type {((string | number)[])}
     */
    get getAttributeValues(): (string | number)[] {
        return Array.from(new Set(this.keyAttribute.values()));
    }

    /**
     * @computed
     * a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the possible values of the attribute specified by $clusterBy -> a list of Node ids]
     *
     * @readonly
     * @type {(Map<string | number, string[]>)}
     */
    get attributeKeys(): Map<string | number, string[]> {
        const attributeKeysMap = new Map<string | number, string[]>();
        this.getAttributeValues.forEach((value) => {
            attributeKeysMap.set(value, []);
        });
        this.keyAttribute.forEach((value, key) => {
            attributeKeysMap.get(value)?.push(key);
        });
        return attributeKeysMap;
    }

    /**
     * @computed
     * a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the possible values of the attribute specified by $clusterBy -> the random colour of this cluster]
     * used to avoid re-compute the colours on every frame refresh
     *
     * @readonly
     * @type {(Map<string | number, string>)}
     */
    get attributeColor(): Map<string | number, string> {
        let colors = randomcolor({
            seed: 1,
            count: this.getAttributeValues.length,
        });
        let position = 0;
        let map = new Map<string | number, string>();
        this.getAttributeValues.forEach((attribute) => {
            map.set(attribute, colors[position++]);
        });
        return map;
    }

    /**
     * @computed
     * a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the possible values of the attribute specified by $clusterBy -> the Nodes points in that cluster]
     * will change on every frame refresh as the Node's position keeps changing.
     *
     * @readonly
     * @type {(Map<string | number, THREE.Vector3[]>)}
     */
    get attributePoints(): Map<string | number, THREE.Vector3[]> {
        let map = new Map<string | number, THREE.Vector3[]>();
        this.getAttributeValues.forEach((attribute) => {
            let vectorList: THREE.Vector3[] = [];
            map.set(attribute, vectorList);
        });
        this.rawGraph.forEachNode((key, attributes) => {
            map.get(this.keyAttribute.get(key) as string | number)?.push(
                new THREE.Vector3(
                    attributes._visualize.x,
                    attributes._visualize.y,
                    attributes._visualize.z
                )
            );
        });
        return map;
    }
}
