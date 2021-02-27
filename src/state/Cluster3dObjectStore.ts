import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { SphereGeometry } from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import { SceneUtils } from "three/examples/jsm/utils/SceneUtils.js";
import State from ".";

export default class Cluster3dObjectStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * the THREE.js WebGL Scene of the visualization
     *
     */
    threeScene!: THREE.Scene;

    /**
     * all the clusters should form a 3D Group to be imported into Scene
     * if no cluster attribute is set, this will be set to null
     *
     * @type {THREE.Group}
     */
    fusionClusterObjects: THREE.Group | null = null;

    /**
     * the map between attribute value and its corresponding Mesh Group
     * if you want to update the geometry, plz update all the children inside which Mesh Group
     * if no cluster attribute is set, this will be set to null
     *
     * @type {(Map<string | number, THREE.Group> | null)}
     */
    clusterObjectsMap: Map<string | number, THREE.Group> | null = null;

    /**
     * create empty BufferGeometry and mesh with colour
     * then initialize $fusionClusterObjects and $clusterObjectsMap with it
     * and then add the THREE.Group to the Scene
     *
     */
    initEmptyMapAndFusion() {
        let initialMap = new Map<string | number, THREE.Group>();
        State.cluster.attributePoints.forEach((value, key) => {
            initialMap.set(
                key,
                this.createMeshGroup(new THREE.BufferGeometry(), key)
            );
        });

        this.clusterObjectsMap = initialMap;
        this.fusionClusterObjects = new THREE.Group();
        initialMap.forEach((value) => {
            this.fusionClusterObjects?.add(value);
        });
        this.threeScene.add(this.fusionClusterObjects);
    }

    /**
     * should be called on each render frame
     * will update the geometry inside each cluster object
     *
     * if is the first time (both are null), will run initEmptyMapAndFusion() first
     *
     * if meet with clusterBy == null, will dispose all Object3d
     *
     */
    clusterDelegation() {
        if (State.cluster.clusterBy === null) {
            if (this.fusionClusterObjects) {
                this.threeScene.remove(this.fusionClusterObjects);
                this.dispose();
            }
            return;
        } else {
            if (
                this.fusionClusterObjects == null ||
                this.convexHullObjects == null
            ) {
                this.initEmptyMapAndFusion();
            }
            this.clusterObjectsMap?.forEach(
                (group: THREE.Group, key: string | number) => {
                    let newBufferGeometry = this.convexHullObject(key);
                    group.children.forEach((mesh: any) => {
                        mesh.geometry.copy(newBufferGeometry);
                    });
                }
            );
        }
    }

    /**
     * dispose the geometries and materials in every clusterObject
     * and set these props to be null, which indicates that no additional 3d object is added into Scene
     *
     */
    dispose() {
        this.clusterObjectsMap?.forEach((group: THREE.Group) => {
            group.children.forEach((mesh: any) => {
                let material = mesh.material as THREE.Material;
                material.dispose();
                mesh.geometry.dispose();
            });
        });
        this.clusterObjectsMap = null;
        this.fusionClusterObjects = null;
    }

    /**
     * the map between the value of the cluster and the BufferGeometry that this cluster created
     *
     * @readonly
     * @type {(Map<string | number, THREE.Group>)}
     */
    get convexHullObjects(): Map<string | number, THREE.BufferGeometry> {
        let newMap = new Map<string | number, THREE.BufferGeometry>();
        State.cluster.attributePoints.forEach((value, key) => {
            newMap.set(key, this.convexHullObject(key));
        });
        return newMap;
    }

    /**
     * get the computed convexHull BufferGeometry of the specified attribute value
     *
     * @param {(string | number)} key
     * @returns {*}  {THREE.BufferGeometry}
     */
    convexHullObject(key: string | number): THREE.BufferGeometry {
        let points = State.cluster.attributePoints.get(key) as THREE.Vector3[];
        if (State.css.cluster.shape === "convexHull") {
            if (!points || points.length < 4) {
                return new THREE.BufferGeometry();
            } else {
                return new ConvexGeometry(Array.from(points));
            }
        } else {
            // State.css.clusterShape === "Sphere"
            let convexGeometry = new ConvexGeometry(Array.from(points));
            convexGeometry.computeBoundingSphere();
            let sphereGeo = convexGeometry.boundingSphere as THREE.Sphere;
            let sphere = new SphereGeometry(sphereGeo.radius, 20, 20);
            sphere.translate(
                sphereGeo.center.x,
                sphereGeo.center.y,
                sphereGeo.center.z
            );
            return sphere;
        }
    }

    /**
     * create a Three.Group, which contains 2 Three.Mesh, of the input geometry
     *
     * @private
     * @param {THREE.BufferGeometry} geom
     * @param {(string | number)} name
     * @returns {*}  {THREE.Group}
     *
     * @see THREE.Mesh
     */
    private createMeshGroup(
        geom: THREE.BufferGeometry,
        name: string | number
    ): THREE.Group {
        const meshMaterial = new THREE.MeshBasicMaterial({
            color: State.cluster.attributeColor.get(name),
            transparent: true,
            opacity: 0.15,
        });
        meshMaterial.side = THREE.DoubleSide; //将材质设置成正面反面都可见
        meshMaterial.depthWrite = false;
        const wireFrameMat = new THREE.MeshBasicMaterial();
        // wireFrameMat.wireframe = true; //把材质渲染成线框
        // wireFrameMat.wireframeLinecap = "round";

        let group = SceneUtils.createMultiMaterialObject(geom, [
            meshMaterial,
            // wireFrameMat,
        ]);
        group.name = "THREE_CLUSTER_" + name;
        return group;
    }
}
