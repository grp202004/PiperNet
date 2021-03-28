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
     * @description if filter search is selected
     * null will be to search on id, and others will be to search based on that attribute value
     * @author Zichen XU
     * @type {(string | null)}
     */
    filterProps: string | null = null;

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
        let outputList: string[] = [];
        let searchStrIgnoreCase = this.searchStr.toLocaleLowerCase();
        if (this.filterProps === null) {
            // search on id
            this.rawGraph.forEachNode((node) => {
                if (node.toLocaleLowerCase().includes(searchStrIgnoreCase)) {
                    outputList.push(node);
                }
            });
        } else {
            // have specify the attribute
            const searchAttr = this.filterProps as string;
            this.rawGraph.forEachNode((node, attributes) => {
                if (
                    attributes.hasOwnProperty(searchAttr) &&
                    (attributes[searchAttr] as string)
                        .toLocaleLowerCase()
                        .includes(searchStrIgnoreCase)
                ) {
                    outputList.push(node);
                }
            });
        }
        return outputList;
    }
}
