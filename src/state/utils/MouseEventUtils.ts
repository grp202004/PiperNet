import ReactDOM from "react-dom";
import State from "..";
import * as THREE from "three";
import { Object3D } from "three";
import ComponentRef from "../../components/ComponentRef";

export const onDocumentLeftClick: EventListener = (evt: Event) => {
    const event = evt as MouseEvent;
    if (
        State.cluster.clusterBy === null ||
        !State.graphDelegate.graphDelegateMethods
    ) {
        return;
    }
    let element = ReactDOM.findDOMNode(ComponentRef.visualizer);
    let box = (element as Element)?.getBoundingClientRect();

    let vector = new THREE.Vector3(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        -((event.clientY - box.top) / box.height) * 2 + 1,
        0.5
    );

    let camera = State.graphDelegate.graphDelegateMethods?.camera();
    if (!camera) {
        return;
    }
    vector = vector.unproject(camera);

    let raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
    );
    let intersects = raycaster.intersectObjects(
        State.graphDelegate.clusterObject.fusionClusterObjects
            ?.children as Object3D[],
        true
    );

    if (intersects.length > 0) {
        State.clusterInteraction.clusterLeftClickCallback(
            intersects[0].object.uuid,
            event
        );
        console.log("currently Clicked ClusterId", intersects[0].object.uuid);
    }
};

export const onDocumentRightClick: EventListener = (evt: Event) => {
    const event = evt as MouseEvent;
    if (
        State.cluster.clusterBy === null ||
        !State.graphDelegate.graphDelegateMethods
    ) {
        return;
    }
    let element = ReactDOM.findDOMNode(ComponentRef.visualizer);
    let box = (element as Element)?.getBoundingClientRect();

    let vector = new THREE.Vector3(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        -((event.clientY - box.top) / box.height) * 2 + 1,
        0.5
    );

    let camera = State.graphDelegate.graphDelegateMethods?.camera();
    if (!camera) {
        return;
    }
    vector = vector.unproject(camera);

    let raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
    );
    let intersects = raycaster.intersectObjects(
        State.graphDelegate.clusterObject.fusionClusterObjects
            ?.children as Object3D[],
        true
    );

    if (intersects.length > 0) {
        State.clusterInteraction.clusterRightClickCallback(
            intersects[0].object.uuid,
            event
        );
    } else {
        State.clusterInteraction.clusterRightClickCallback(null, event);
    }
    console.log(
        "currently Right-Clicked ClusterId",
        intersects[0]?.object?.uuid ?? null
    );
};

export function onDocumentMouseMove(this: Element, event: MouseEvent) {
    if (
        State.cluster.clusterBy === null ||
        !State.graphDelegate.graphDelegateMethods
    ) {
        State.clusterInteraction.currentlyHoveredClusterId = null;
        return;
    }
    let element = ReactDOM.findDOMNode(ComponentRef.visualizer);
    let box = (element as Element)?.getBoundingClientRect();

    let vector = new THREE.Vector3(
        ((event.clientX - box.left) / box.width) * 2 - 1,
        -((event.clientY - box.top) / box.height) * 2 + 1,
        0.5
    );

    let camera = State.graphDelegate.graphDelegateMethods?.camera();
    if (!camera) {
        return;
    }
    vector = vector.unproject(camera);

    let raycaster = new THREE.Raycaster(
        camera.position,
        vector.sub(camera.position).normalize()
    );
    let intersects = raycaster.intersectObjects(
        State.graphDelegate.clusterObject.fusionClusterObjects
            ?.children as Object3D[],
        true
    );

    if (intersects.length > 0) {
        State.clusterInteraction.clusterHoverCallback(
            intersects[0].object.uuid,
            event
        );
    } else {
        State.clusterInteraction.clusterHoverCallback(null, event);
    }
    console.log(
        "currentlyHoveredClusterId",
        intersects[0]?.object?.uuid ?? null
    );
}
