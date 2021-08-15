import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import randomcolor from "randomcolor";
import State from ".";

/**
 * this store handles the cluster generating according to the clusterBy defined by user
 * by applying the computed value in MobX
 * the keyAttributes, getAttributeValues, attributeKeys, attributeColor and attributePoints will auto-compute accordingly in code reference order
 * and ultimately produce a mapping from (the cluster value) to (a array of node points)
 * which shall be used by Cluster3DObjectStore to compute the 3D-convex hull used in the 3d-renderer
 *
 * @export
 * @class ClusterStore
 */
export default class ClusterStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * @description specify which attribute to be clustered
     * the default value should be null, and front-end graph will interpret this to Not-Cluster
     *
     * @summary attention: please use setCluster() to alter this data
     * @author Zichen XU
     * @type {(string | null)}
     */
    clusterBy: string | null = null;

    /**
     * @description specify which level of clusters are shown
     * @author Chenghao SHI
     * @type {string}
     */
    showlevel: string | null = "None";

    /**
     * @description the setter of clusterBy
     * will update the front-end 3d graph about the cluster changes
     * @author Zichen XU
     * @param {(string | null)} to
     * @param {boolean} [forceUpdate=false]
     */
    setCluster(to: string | null, forceUpdate: boolean = false) {
        if (forceUpdate) {
            this.setCluster(null);
            this.setCluster(to);
        } else {
            this.clusterBy = to;
            State.graphDelegate.clusterObject.initEmptyMapAndFusion();
            State.graph.refreshGraph();
            State.graph.rawGraph.setAttribute("default", to);
        }
    }

    /**
     * @computed
     * @description a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the id of a Node -> the value of the attribute specified by $clusterBy]
     * @author Zichen XU
     * @readonly
     * @type {(Map<string, string | number>)}
     */
    get keyAttribute(): Map<string, string | number> {
        const keyValueMap = new Map<string, string | number>();
        if (this.clusterBy === null) {
            return keyValueMap;
        }
        const attribute = this.clusterBy as string;

        State.graph.rawGraph.forEachNode((key, attributes) => {
            // if this attribute is defined
            if (attributes.hasOwnProperty(attribute)) {
                if (attributes[attribute] === "") {
                    // ignore those which empty attribute
                } else {
                    keyValueMap.set(key, attributes[attribute]);
                }
            } else {
                // this attribute is undefined in this node
            }
        });
        return keyValueMap;
    }

    /**
     * @computed
     * @description the possible attribute values of the attribute defined by $clusterBy
     * @author Zichen XU
     * @readonly
     * @type {((string | number)[])}
     */
    get getAttributeValues(): (string | number)[] {
        return Array.from(new Set(this.keyAttribute.values()));
    }

    /**
     * @computed
     * @description a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the possible values of the attribute specified by $clusterBy -> a list of Node ids]
     * @author Zichen XU
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
     * @description a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the possible values of the attribute specified by $clusterBy -> the random colour of this cluster]
     * used to avoid re-compute the colours on every frame refresh
     * @author Zichen XU
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
     * @description a auto computed map
     * will auto-update if $rawGraph or $clusterBy is changed
     * [the possible values of the attribute specified by $clusterBy -> the Nodes points in that cluster]
     * will change on every frame refresh as the Node's position keeps changing.
     * @author Zichen XU
     * @readonly
     * @type {(Map<string | number, THREE.Vector3[]>)}
     */
    get attributePoints(): Map<string | number, THREE.Vector3[]> {
        let map = new Map<string | number, THREE.Vector3[]>();
        this.getAttributeValues.forEach((attribute) => {
            let vectorList: THREE.Vector3[] = [];
            map.set(attribute, vectorList);
        });
        State.graph.rawGraph.forEachNode((key, attributes) => {
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
