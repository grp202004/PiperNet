import { observable } from "mobx";

export default class ImportStore {
    @observable graphFile = "";
    @observable nodeFile = "";

    @observable importCSVDialogOpen = false;
    @observable importGEXFDialogOpen = false;

    // specific: File object selected via the file input.
    @observable selectedEdgeFileFromInput = null;
    @observable selectedNodeFileFromInput = null;

    @observable selectedGEXFFileFromInput = null;

    @observable importConfig = {
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
                id: "<UNK>",
                cluster: "<UNK>",
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
                fromId: "<UNK>",
                toId: "<UNK>",
            },
            delimiter: ",",
        },
    };
}
