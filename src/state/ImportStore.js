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
            path: "",

            // has header at the top
            hasHeader: true,

            //names for the columns of this csv
            columns: [],
            mapping: {
                id: "<UNK>",
                cluster: "<UNK>",
            },
            delimiter: ",",
        },
        edgeFile: {
            // should save the csv to temp for further change the cluster attribute
            path: "",
            hasHeader: true,
            columns: [],
            mapping: {
                fromId: "<UNK>",
                toId: "<UNK>",
            },
            delimiter: ",",
        },
    };
}
