import { makeAutoObservable } from "mobx";

class ComponentRef {
    constructor() {
        makeAutoObservable(this);
    }

    static _instance: ComponentRef | null = null;

    nodeDetail!: any;

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

export default ComponentRef.instance;
