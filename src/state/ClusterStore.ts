import { makeAutoObservable, observable } from "mobx";
import Graph from "graphology";
import * as THREE from "three";
import randomcolor from "randomcolor";

export default class ClusterStore {
    constructor() {
        makeAutoObservable(this, {
            rawGraph: observable.ref,
        });
    }
    clusterBy = "None";

    rawGraph!: Graph;

    // the map between [the id of a Node and the value of the attribute specified by $clusterBy]
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

    // the possible attribute values of the attribute defined by clusterBy
    get getAttributeValues(): (string | number)[] {
        return Array.from(new Set(this.keyAttribute.values()));
    }

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
