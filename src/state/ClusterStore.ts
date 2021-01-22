import { observable, makeObservable, computed, autorun } from "mobx";
import Graph from "graphology";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import State from ".";

export default class ClassStore {
    constructor() {
        makeObservable(this, {
            clusterBy: observable,
            rawGraph: observable.ref,
            getKeyAttribute: computed,
            getAttributeValues: computed,
            attributePoints: observable,
            convexHullObjects: observable,
            // centerPoints: observable,
        });
    }
    clusterBy = "publish_time";

    rawGraph!: Graph;

    get getKeyAttribute(): Map<string, string | number> {
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

    addPoints(id: string, x: number, y: number, z: number) {
        this.attributePoints
            .get(this.getKeyAttribute.get(id) as string | number)
            ?.push(new THREE.Vector3(x, y, z));
    }

    // the possible attribute values of the attribute defined by clusterBy
    get getAttributeValues(): (string | number)[] {
        return Array.from(new Set(this.getKeyAttribute.values()));
    }

    attributePoints = new Map<string | number, THREE.Vector3[]>();

    autoRefreshAttributePointsMap() {
        let newAttributePointsMap = new Map<string | number, THREE.Vector3[]>();
        this.getAttributeValues.map((attribute) => {
            let vectorList: THREE.Vector3[] = [];
            newAttributePointsMap.set(attribute, vectorList);
        });
        this.attributePoints = newAttributePointsMap;
    }

    convexHullObjects = new Map<string, THREE.Object3D>();

    // explicitly called when all node's position have been added to the map
    computeConvexHullObjects() {
        let newMap = new Map<string, THREE.Object3D>();
        this.attributePoints.forEach((value, key) => {
            let keyString = "_CLUSTER_";
            if (key as string) {
                keyString += <string>key;
            } else {
                keyString += (<number>key).toString();
            }
            if (value.length < 4) {
                newMap.set(keyString, new THREE.Object3D());
            } else {
                let convexHull = new ConvexGeometry(Array.from(value));
                newMap.set(keyString, this.createMesh(convexHull));
            }
        });
        this.convexHullObjects = newMap;
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

    private createMesh(geom: ConvexGeometry): THREE.Object3D {
        // 实例化一个绿色的半透明的材质
        var meshMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.2,
        });
        meshMaterial.side = THREE.DoubleSide; //将材质设置成正面反面都可见
        var wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true; //把材质渲染成线框

        // 将两种材质都赋给几何体
        var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [
            meshMaterial,
            wireFrameMat,
        ]);

        return mesh;
    }
}
