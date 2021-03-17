import Graph from "graphology";
import { makeAutoObservable, observable } from "mobx";

/**
 * @description this file is the backend support for the NodeSearch feature
 * and will compute the possible searching candidates according to the query parameters
 * @author Zichen XU
 * @export
 * @class SearchStore
 */
export default class SearchStore {
    constructor() {
        makeAutoObservable(this, {
            rawGraph: observable.ref,
        });
    }

    //
    /**
     * @description if is previewing, ignore all mouse hovers detected by NodeDetailPanel
     * because it is showing the detail of selected node
     * @author Zichen XU
     */
    isPreviewing = false;

    /**
     * @description the search string typed in by user
     * can use defined regex like:
     * id:123
     * attr:color:red
     * @author Zichen XU
     */
    searchStr = "";

    /**
     * @observable .ref
     * the reference bounded to the GraphStore/rawGraph
     *
     * @type {Graph}
     */
    rawGraph!: Graph;

    // contains node ids

    /**
     * @description compute a list of nodeids queried by the searchStr
     * @author Zichen XU
     * @type {string[]}
     */
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
