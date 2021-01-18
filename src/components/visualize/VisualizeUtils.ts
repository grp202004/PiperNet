import State from "../../state";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

export function computeConvexHull(map: Map<string | number, THREE.Vector3[]>) {
    let newMap = new Map<string | number, THREE.Object3D>();
    map.forEach(function (value, key) {
        let convexHull = new ConvexGeometry(value);
        newMap.set(key, createMesh(convexHull));
    });
    return newMap;
}

function createMesh(geom: ConvexGeometry): THREE.Object3D {
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

// 反转一下，这样在Graph里面比较好loop
export function getClusters(attribute: string): Map<string | number, string[]> {
    function pushKey(
        valueKeyMap: Map<string | number, string[]>,
        attributeValue: string | number,
        key: string
    ) {
        valueKeyMap.has(attributeValue)
            ? valueKeyMap.get(attributeValue)?.push(key)
            : valueKeyMap.set(attributeValue, [key]);
    }

    let valueKeyMap = new Map<string | number, string[]>();

    State.graph.rawGraph.forEachNode((key, attributes) => {
        if (attributes.hasOwnProperty(attribute)) {
            pushKey(valueKeyMap, attributes[attribute], key);
        } else {
            // this attribute is undefined in this node
            pushKey(valueKeyMap, "undefined", key);
        }
    });

    return valueKeyMap;
}
