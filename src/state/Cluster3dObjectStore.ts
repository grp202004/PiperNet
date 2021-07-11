import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { SphereGeometry } from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import State from ".";
import chaser from "chaser";

/**
 * @description the code in this file basically initialize the corresponding Object3D for each cluster
 * control the addition/deletion/disposition/accessing/updatePosition/updateMaterial of clusters inside the scene
 * according to the updated map from ClusterStore
 * @author Zichen XU
 * @export
 * @class Cluster3dObjectStore
 */
export default class Cluster3dObjectStore {
    constructor() {
        makeAutoObservable(this);
    }

    /**
     * @description the THREE.js WebGL Scene of the visualization
     * @author Zichen XU
     * @type {THREE.Scene}
     */
    threeScene!: THREE.Scene;

    /**
     * @description all the clusters should form a 3D Group to be imported into Scene
     * if no cluster attribute is set, this will be set to null
     *
     * each children is a THREE.Mesh
     * @author Zichen XU
     * @type {(THREE.Group | null)}
     */
    fusionClusterObjects: THREE.Group | null = null;

    /**
     * @description the map between attribute value and its corresponding Mesh Group
     * if you want to update the geometry, plz update all the children inside which Mesh Group
     * if no cluster attribute is set, this will be set to null
     * @author Zichen XU
     * @type {(Map<string | number, THREE.Mesh> | null)}
     */
    clusterObjectsMap: Map<string | number, THREE.Mesh> | null = null;

    /**
     * @description create empty BufferGeometry and mesh with colour
     * then initialize $fusionClusterObjects and $clusterObjectsMap with it
     * and then add the THREE.Group to the Scene
     * @author Zichen XU
     * @returns {*}
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
     * @description should be called on each render frame
     * will update the geometry inside each cluster object
     *
     * if is the first time (both are null), will run initEmptyMapAndFusion() first
     *
     * if meet with clusterBy == null, will dispose all Object3d
     * @author Zichen XU
     * @returns {*}
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

    /**
     * @description get the THREE.Mesh object by its uuid
     * @author Zichen XU
     * @param {string} uuid
     * @returns {*}  {(THREE.Mesh | null)}
     */
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
     * @description dispose the geometries and materials in every clusterObject
     * and set these props to be null, which indicates that no additional 3d object is added into Scene
     * @author Zichen XU
     */
    private dispose() {
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
     * @description the map between the value of the cluster and the BufferGeometry that this cluster created
     * @author Zichen XU
     * @readonly
     * @type {(Map<string | number, THREE.BufferGeometry>)}
     */
    get convexHullObjects(): Map<string | number, THREE.BufferGeometry> {
        let newMap = new Map<string | number, THREE.BufferGeometry>();
        State.cluster.attributePoints.forEach((value, key) => {
            newMap.set(key, this.convexHullObject(key));
        });
        return newMap;
    }

    /**
     * @description get the computed convexHull BufferGeometry of the specified attribute value
     * @author Zichen XU
     * @param {(string | number)} key
     * @returns {*}  {THREE.BufferGeometry}
     */
    private convexHullObject(key: string | number): THREE.BufferGeometry {
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
            let sphere2 = new SphereGeometry(
                State.css.node.size + 10,
                State.css.cluster.resolution,
                State.css.cluster.resolution
            );
            sphere2.translate(points[0].x, points[0].y, points[0].z);
            return sphere2 && sphere;
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
     * @description create a Three.Group, which contains 2 Three.Mesh, of the input geometry
     * @author Zichen XU
     * @private
     * @param {THREE.BufferGeometry} geom
     * @param {(string | number)} name
     * @returns {*}  {THREE.Mesh}
     */
    private createMesh(
        geom: THREE.BufferGeometry,
        name: string | number
    ): THREE.Mesh {
        const color = State.cluster.attributeColor.get(name);
        const meshMaterial = new THREE.MeshBasicMaterial();
        let mesh = new THREE.Mesh(geom, meshMaterial);
        //@ts-ignore
        mesh["_color"] = color;
        this.meshNormalMaterial(mesh);
        this.UUID2ClusterValueMap.set(mesh.uuid, name);
        mesh.name = "THREE_CLUSTER_" + name;
        return mesh;
    }

    /**
     * @description a map from (the uuid that get from the WebGL) to (the cluster value of this cluster)
     * @author Zichen XU
     * @type {(Map<string, string | number>)}
     */
    UUID2ClusterValueMap!: Map<string, string | number>;

    /**
     * @description add the mesh material a short highlight
     * @author Zichen XU
     * @param {THREE.Mesh} mesh
     */
    meshSpotlightMaterial(mesh: THREE.Mesh) {
        let material = mesh.material as THREE.Material;
        const oldOpacity = material.opacity;
        material.opacity = 1;
        setTimeout(() => {
            material.opacity = oldOpacity;
        }, 50);
    }

    /**
     * @description set the mesh material to be highlighted
     * @author Zichen XU
     * @private
     * @param {THREE.Mesh} mesh
     */
    private meshHighlightMaterial(mesh: THREE.Mesh) {
        mesh.material = new THREE.MeshBasicMaterial({
            //@ts-ignore
            color: mesh["_color"],
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
        });
        mesh.material.side = THREE.DoubleSide;
        mesh.material.depthWrite = false;
    }

    /**
     * @description set the mesh material to be as selected
     * @author Zichen XU
     * @private
     * @param {THREE.Mesh} mesh
     */
    private meshSelectedMaterial(mesh: THREE.Mesh) {
        mesh.material = new THREE.MeshPhongMaterial({
            //@ts-ignore
            color: mesh["_color"],
            shininess: 20,
            // emissive: "white",
            opacity: 0.9,
            transparent: true,
        });
        mesh.material.depthWrite = false;
    }

    /**
     * @description set the mesh material back to normal
     * @author Zichen XU
     * @private
     * @param {THREE.Mesh} mesh
     */
    private meshNormalMaterial(mesh: THREE.Mesh) {
        mesh.material = new THREE.MeshBasicMaterial({
            //@ts-ignore
            color: mesh["_color"],
            transparent: true,
            opacity: 0.15,
        });
        mesh.material.side = THREE.DoubleSide;
        mesh.material.depthWrite = false;
    }

    /**
     * @description update and refresh all materials of all the cluster objects
     * @author Zichen XU
     */
    updateAllMaterials() {
        this.fusionClusterObjects?.children.forEach((_object) => {
            let mesh = _object as THREE.Mesh;
            const meshId = mesh.uuid;
            if (State.clusterInteraction.currentlyHoveredClusterId === meshId) {
                this.meshHighlightMaterial(mesh);
            } else if (
                State.clusterInteraction.selectedClusters.includes(meshId)
            ) {
                this.meshSelectedMaterial(mesh);
            } else {
                this.meshNormalMaterial(mesh);
            }
        });
    }

    /**
     * @description determine whether at this time can the node to be auto-altered to the surface of the sphere
     * if the engine reheat, will set this to true.
     * @author Zichen XU
     * @type {boolean}
     */
    canAlterNodePosition: boolean = false;

    /**
     * @description alter the nodes onto the surface of the sphere in 1s
     * using the computeNodeSphereDistribution() to compute the position
     * @author Zichen XU
     */
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

    /**
     * @description using a algorithm to compute a array of points that distribute on the sphere specified by the radius
     * @author Zichen XU
     * @private
     * @param {number} radius
     * @param {number} [numberOfPoints=45]
     * @returns {*}  {{ x: number; y: number; z: number }[]}
     */
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
