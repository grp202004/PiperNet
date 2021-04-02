import { makeAutoObservable } from "mobx";
import State from ".";

/**
 * @description this file is the backend support for the NodeSearch feature
 * and will compute the possible searching candidates according to the query parameters
 * @author Zichen XU
 * @export
 * @class SearchStore
 */
export default class SearchStore {
    constructor() {
        makeAutoObservable(this);
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
            State.graph.rawGraph.forEachNode((node) => {
                if (node.toLocaleLowerCase().includes(searchStrIgnoreCase)) {
                    outputList.push(node);
                }
            });
        } else {
            // have specify the attribute
            const searchAttr = this.filterProps as string;
            State.graph.rawGraph.forEachNode((node, attributes) => {
                if (attributes.hasOwnProperty(searchAttr)) {
                    let attribute = attributes[searchAttr];
                    if (
                        attribute
                            .toString()
                            .toLocaleLowerCase()
                            .includes(searchStrIgnoreCase)
                    ) {
                        outputList.push(node);
                    }
                }
            });
        }
        return outputList;
    }
}
