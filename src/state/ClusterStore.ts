import { observable, makeObservable, computed, autorun } from "mobx";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import State from ".";

export default class ClassStore {
    constructor() {
        makeObservable(this, {
            clusterBy: observable,
            getKeyAttribute: computed,
            getAttributeValues: computed,
            attributePoints: observable,
            convexHullObjects: observable,
        });
    }
    clusterBy = "publish_time";

    get getKeyAttribute(): Map<string, string | number> {
        const attribute = this.clusterBy;
        const keyValueMap = new Map<string, string | number>();

        State.graph.rawGraph.forEachNode((key, attributes) => {
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

    convexHullObjects = new Map<string | number, THREE.Object3D>();

    // explicitly called when all node's position have been added to the map
    computeConvexHullObjects() {
        let newMap = new Map<string | number, THREE.Object3D>();
        this.attributePoints.forEach((value, key) => {
            if (value.length < 4) {
                newMap.set(key, new THREE.Object3D());
            } else {
                let convexHull = new ConvexGeometry(Array.from(value));
                newMap.set(key, this.createMesh(convexHull));
            }
        });
        this.convexHullObjects = newMap;
    }

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
