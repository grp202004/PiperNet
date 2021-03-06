import { makeAutoObservable, reaction } from "mobx";
import State from "../state";

class ComponentRef {
    constructor() {
        makeAutoObservable(this);
    }

    static _instance: ComponentRef | null = null;

    nodeDetail!: React.Component | any;

    multiNodeDetail!: React.Component | any;

    visualizer!: React.Component | any;

    // add singleton to prevent creating multiple instances of the State class
    static get instance() {
        if (ComponentRef._instance === null) {
            let instance = new ComponentRef();
            ComponentRef._instance = instance;
            return instance;
        } else {
            return ComponentRef._instance;
        }
    }
}

reaction(
    () => State.interaction.currentlyHoveredNodeId,
    () => ComponentRef.instance.nodeDetail?.forceUpdate()
);

export default ComponentRef.instance;
