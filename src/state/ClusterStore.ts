import { makeAutoObservable, observable } from "mobx";
import Graph from "graphology";
import * as THREE from "three";
import randomcolor from "randomcolor";

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
     * Specify which attribute to be clustered
     * if this is changed, all get values will be updated
     *
     * @memberof ClusterStore
     */
    clusterBy = "None";

    /**
     * @observable .ref
     * the reference bounded to the GraphStore/rawGraph
     *
     * @type {Graph}
     * @memberof ClusterStore
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
     * @memberof ClusterStore
     */
    get keyAttribute(): Map<string, string | number> {
        const attribute = this.clusterBy;
        const keyValueMap = new Map<string, string | number>();

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
     * @memberof ClusterStore
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
     * @memberof ClusterStore
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
     * @memberof ClusterStore
     */
    get attributeColor(): Map<string | number, string> {
        let colors = randomcolor({
            seed: 1,
            count: this.getAttributeValues.length,
        });
        let position = 0;
        let map = new Map<string | number, string>();
        this.getAttributeValues.map((attribute) => {
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
     * @memberof ClusterStore
     */
    get attributePoints(): Map<string | number, THREE.Vector3[]> {
        let map = new Map<string | number, THREE.Vector3[]>();
        this.getAttributeValues.map((attribute) => {
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
