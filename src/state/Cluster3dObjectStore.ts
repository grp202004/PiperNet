import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { SphereGeometry } from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import State from ".";
import chaser from "chaser";

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
     * each children is a THREE.Mesh
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
    clusterObjectsMap: Map<string | number, THREE.Mesh> | null = null;

    /**
     * create empty BufferGeometry and mesh with colour
     * then initialize $fusionClusterObjects and $clusterObjectsMap with it
     * and then add the THREE.Group to the Scene
     *
     */
    initEmptyMapAndFusion() {
        if (this.fusionClusterObjects) {
            this.threeScene.remove(this.fusionClusterObjects);
            this.dispose();
        }
        if (State.cluster.clusterBy === null) {
            return;
        }
        this.UUID2ClusterValueMap = new Map<string, string | number>();
        let initialMap = new Map<string | number, THREE.Mesh>();
        State.cluster.attributePoints.forEach((value, key) => {
            initialMap.set(
                key,
                this.createMesh(new THREE.BufferGeometry(), key)
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
            return;
        } else {
            if (
                this.fusionClusterObjects == null ||
                this.convexHullObjects == null
            ) {
                this.initEmptyMapAndFusion();
            }
            this.clusterObjectsMap?.forEach(
                (mesh: THREE.Mesh, key: string | number) => {
                    mesh.geometry.copy(this.convexHullObject(key));
                }
            );
        }
    }

    getObjectById(uuid: string): THREE.Mesh | null {
        let res: THREE.Object3D | null = null;
        this.fusionClusterObjects?.children.every((item: THREE.Object3D) => {
            if (item.uuid === uuid) {
                res = item;
                return false;
            } else {
                return true;
            }
        });
        return res;
    }

    /**
     * dispose the geometries and materials in every clusterObject
     * and set these props to be null, which indicates that no additional 3d object is added into Scene
     *
     */
    dispose() {
        this.clusterObjectsMap?.forEach((mesh: THREE.Mesh) => {
            let material = mesh.material as THREE.Material;
            material.dispose();
            mesh.geometry.dispose();
        });
        this.clusterObjectsMap = null;
        this.fusionClusterObjects = null;
        this.UUID2ClusterValueMap = new Map<string, string | number>();
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

        if (!points || points.length === 0) {
            return new THREE.BufferGeometry();
        } else if (points.length === 1) {
            let sphere = new SphereGeometry(
                State.css.node.size + 5,
                State.css.cluster.resolution,
                State.css.cluster.resolution
            );
            sphere.translate(points[0].x, points[0].y, points[0].z);
            return sphere;
        } else if (points.length < 4) {
            // there are 2 or 3 points in this cluster
            let geometry = new THREE.BufferGeometry();
            let tempArray: number[] = [];
            points.forEach((vector) => {
                tempArray.push(vector.x, vector.y, vector.z);
            });
            const positions = new Float32Array(tempArray);
            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );
            geometry.computeBoundingSphere();
            let sphereGeo = geometry.boundingSphere as THREE.Sphere;
            let sphere = new SphereGeometry(
                sphereGeo.radius + 5,
                State.css.cluster.resolution,
                State.css.cluster.resolution
            );
            sphere.translate(
                sphereGeo.center.x,
                sphereGeo.center.y,
                sphereGeo.center.z
            );
            return sphere;
        } else {
            if (State.css.cluster.shape === "convexHull") {
                // when there are more than 3 points, simply gnerate a convexgeometry
                return new ConvexGeometry(Array.from(points));
            } else {
                // State.css.clusterShape === "Sphere"
                let convexGeometry = new ConvexGeometry(Array.from(points));
                convexGeometry.computeBoundingSphere();
                let sphereGeo = convexGeometry.boundingSphere as THREE.Sphere;
                let sphere = new SphereGeometry(
                    sphereGeo.radius + 5,
                    State.css.cluster.resolution,
                    State.css.cluster.resolution
                );
                sphere.translate(
                    sphereGeo.center.x,
                    sphereGeo.center.y,
                    sphereGeo.center.z
                );
                return sphere;
            }
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
    private createMesh(
        geom: THREE.BufferGeometry,
        name: string | number
    ): THREE.Mesh {
        const meshMaterial = new THREE.MeshBasicMaterial({
            color: State.cluster.attributeColor.get(name),
            transparent: true,
            opacity: 0.15,
        });
        meshMaterial.side = THREE.DoubleSide; //将材质设置成正面反面都可见
        meshMaterial.depthWrite = false;

        let mesh = new THREE.Mesh(geom, meshMaterial);
        this.UUID2ClusterValueMap.set(mesh.uuid, name);
        mesh.name = "THREE_CLUSTER_" + name;
        return mesh;
    }

    UUID2ClusterValueMap!: Map<string, string | number>;

    meshSpotlightMaterial(mesh: THREE.Mesh) {
        let material = mesh.material as THREE.Material;
        const oldOpacity = material.opacity;
        material.opacity = 0.7;
        setTimeout(() => {
            material.opacity = oldOpacity;
        }, 100);
    }

    private static meshHighlightMaterial(mesh: THREE.Mesh) {
        let material = mesh.material as THREE.Material;
        material.opacity = 0.5;
    }

    private static meshSelectedMaterial(mesh: THREE.Mesh) {
        let material = mesh.material as THREE.Material;
        material.opacity = 0.3;
    }

    private static meshNormalMaterial(mesh: THREE.Mesh) {
        let material = mesh.material as THREE.Material;
        material.opacity = 0.15;
    }

    updateAllMaterials() {
        this.fusionClusterObjects?.children.forEach((_object) => {
            let mesh = _object as THREE.Mesh;
            const meshId = mesh.uuid;
            if (State.clusterInteraction.currentlyHoveredClusterId === meshId) {
                Cluster3dObjectStore.meshHighlightMaterial(mesh);
                return;
            } else if (
                State.clusterInteraction.selectedClusters.includes(meshId)
            ) {
                Cluster3dObjectStore.meshSelectedMaterial(mesh);
                return;
            } else {
                Cluster3dObjectStore.meshNormalMaterial(mesh);
            }
        });
    }

    canAlterNodePosition: boolean = false;

    alterNodePosition() {
        interface chaserAndPosition {
            chaser: any;
            position: { x: number; y: number; z: number };
        }

        let chaserListX: chaserAndPosition[] = [];
        let chaserListY: chaserAndPosition[] = [];
        let chaserListZ: chaserAndPosition[] = [];

        State.cluster.attributeKeys.forEach((points, cluster) => {
            const sphereGeometry = this.clusterObjectsMap?.get(
                cluster
            ) as THREE.Mesh;
            const radius = sphereGeometry.geometry.boundingSphere?.radius!;
            let position = sphereGeometry.geometry.boundingSphere?.center!;
            let newPositions = this.computeNodeSphereDistribution(
                radius,
                points.length
            );

            newPositions.forEach((value, index) => {
                let attribute = State.graph.rawGraph.getNodeAttribute(
                    points[index],
                    "_visualize"
                );
                const chaserX = chaser({
                    initialValue: attribute.x,
                    duration: 1000,
                });
                chaserX.target = value.x + position.x;
                chaserListX.push({ chaser: chaserX, position: attribute });

                const chaserY = chaser({
                    initialValue: attribute.y,
                    duration: 1000,
                });
                chaserY.target = value.y + position.y;
                chaserListY.push({ chaser: chaserY, position: attribute });

                const chaserZ = chaser({
                    initialValue: attribute.z,
                    duration: 1000,
                });
                chaserZ.target = value.z + position.z;
                chaserListZ.push({ chaser: chaserZ, position: attribute });
            });
        });

        let interval = setInterval(() => {
            chaserListX.forEach((value) => {
                value.position.x = value.chaser.value;
            });
            chaserListY.forEach((value) => {
                value.position.y = value.chaser.value;
            });
            chaserListZ.forEach((value) => {
                value.position.z = value.chaser.value;
            });
            State.graphDelegate.graphDelegateMethods.refresh();
        }, 50);
        setTimeout(() => clearInterval(interval), 1000);
    }

    private computeNodeSphereDistribution(
        radius: number,
        numberOfPoints = 45
    ): { x: number; y: number; z: number }[] {
        let dlong = Math.PI * (3.0 - Math.sqrt(5.0));
        let dz = 2.0 / numberOfPoints;
        let long = 0.0;
        let z = 1.0 - dz / 2.0;
        let ptsOnSphere: { x: number; y: number; z: number }[] = [];
        for (let index = 0; index < numberOfPoints; index++) {
            let r = Math.sqrt(1.0 - z * z);
            let ptNew = {
                x: Math.cos(long) * r * radius,
                y: Math.sin(long) * r * radius,
                z: z * radius,
            };
            ptsOnSphere.push(ptNew);
            z = z - dz;
            long = long + dlong;
        }
        return ptsOnSphere;
    }
}
