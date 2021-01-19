import State from "../../state";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";

export function computeConvexHull(
    map: Map<string | number, Set<THREE.Vector3>>
) {
    let newMap = new Map<string | number, THREE.Object3D>();
    map.forEach(function (value, key) {
        if (value.size < 4) {
            newMap.set(key, new THREE.Object3D());
        } else {
            let convexHull = new ConvexGeometry(Array.from(value));
            newMap.set(key, createMesh(convexHull));
        }
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
