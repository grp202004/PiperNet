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
    clusterBy = "publish_time";

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

    // centerPoints = new Map<string, THREE.Vector3>();

    // // explicitly called when all node's position have been added to the map
    // computeCenterPoints() {
    //     let newMap = new Map<string, THREE.Vector3>();
    //     this.attributePoints.forEach((value, key) => {
    //         let keyString = "_CLUSTER_";
    //         if (key as string) {
    //             keyString += <string>key;
    //         } else {
    //             keyString += (<number>key).toString();
    //         }
    //         if (value.length < 4) {
    //             newMap.set(keyString, new THREE.Object3D());
    //         } else {
    //             let convexHull = new ConvexGeometry(Array.from(value));
    //             newMap.set(keyString, this.createMesh(convexHull));
    //         }
    //     });
    //     this.convexHullObjects = newMap;
    // }
}
