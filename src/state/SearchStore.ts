import Graph from "graphology";
import { makeAutoObservable, observable } from "mobx";

export default class SearchStore {
    constructor() {
        makeAutoObservable(this, {
            rawGraph: observable.ref,
        });
    }

    // if is previewing, ignore all mouse hovers detected by NodeDetailPanel because it is showing the detail of selected node
    isPreviewing = false;

    // can use defined regex
    // id:123
    // attr:color:red
    searchStr = "";

    /**
     * @observable .ref
     * the reference bounded to the GraphStore/rawGraph
     *
     * @type {Graph}
     * @memberof ClusterStore
     */
    rawGraph!: Graph;

    // contains node ids
    get candidates(): string[] {
        let list: string[] = [];
        let searchStrIgnoreCase = this.searchStr.toLocaleLowerCase();
        if (searchStrIgnoreCase.match(/^id:.+/g)) {
            const searchId = searchStrIgnoreCase.split(/^id:/g)[1].trim();
            this.rawGraph.forEachNode((node) => {
                if (node.toLocaleLowerCase().includes(searchId)) {
                    list.push(node);
                }
            });
        } else if (searchStrIgnoreCase.match(/^attr:.+:.+/g)) {
            let searchQuery = searchStrIgnoreCase
                .split(/^attr:/g)[1]
                .trim()
                .split(/:/g);
            const searchAttr = searchQuery[0].trim();
            const searchValue = searchQuery[1].trim();
            this.rawGraph.forEachNode((node, attributes) => {
                if (
                    attributes.hasOwnProperty(searchAttr) &&
                    (attributes[searchAttr] as string)
                        .toLocaleLowerCase()
                        .includes(searchValue)
                ) {
                    list.push(node);
                }
            });
        } else if (this.searchStr === "") {
        } else {
            this.rawGraph.forEachNode((node) => {
                if (node.toLocaleLowerCase().includes(this.searchStr)) {
                    list.push(node);
                }
            });
        }

        return list;
    }
}
