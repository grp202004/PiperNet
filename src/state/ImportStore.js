import { observable, makeObservable } from "mobx";

export default class ImportStore {
    //name of the edge file
    edgeFileName = "Choose Edge File ...";

    //name of the node file
    nodeFileName = "Choose Node File ...";

    importCSVDialogOpen = false;
    importGEXFDialogOpen = false;

    // specific: File object selected via the file input.
    selectedEdgeFileFromInput = null;
    selectedNodeFileFromInput = null;

    selectedGEXFFileFromInput = null;

    importConfig = {
        nodeFile: {
            hasNodeFile: false,

            // the file is successfully parsed and ready for display
            isReady: false,
            canImport: false,
            path: "",

            // has header at the top
            hasHeader: true,

            // Get top 20 lines. Or if there's less than 10 line, get all the lines.
            topN: [],
            //names for the columns of this csv
            columns: [],
            mapping: {
                id: "Unknown",
                cluster: "Unknown",
            },
            delimiter: ",",
        },
        edgeFile: {
            isReady: false,
            canImport: false,

            // should save the csv to temp for further change the cluster attribute
            path: "",
            hasHeader: true,

            // array of objects storing the
            topN: [],
            columns: [],
            mapping: {
                fromId: "Unknown",
                toId: "Unknown",
            },
            delimiter: ",",
        },
    };

    constructor() {
        makeObservable(this, {
            edgeFileName: observable,
            nodeFileName: observable,
            importCSVDialogOpen: observable,
            importGEXFDialogOpen: observable,
            selectedEdgeFileFromInput: observable,
            selectedNodeFileFromInput: observable,
            selectedGEXFFileFromInput: observable,
            importConfig: observable,
        });
    }
}
