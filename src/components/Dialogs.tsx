import React from "react";

import ImportDialog from "./dialogs/importDialog";
import ExportDialog from "./dialogs/ExportDialog";
import NodeDataSheetDialog from "./dialogs/NodeDataSheetDialog";
import EdgeDataSheetDialog from "./dialogs/EdgeDataSheetDialog";
import AddNodeDialog from "./dialogs/AddNodeDialog";
import AddEdgeDialog from "./dialogs/AddEdgeDialog";
import ImportGEXFDialog from "./dialogs/ImportGEXFDialog";

/**
 * @description all the dialogs that may appear
 * @author Zichen XU, Zhiyuan LYU
 * @export
 * @class Dialogs
 * @extends {React.Component}
 */
export default class Dialogs extends React.Component {
    render() {
        return (
            <div style={{ display: "none" }}>
                <ImportGEXFDialog />
                <ImportDialog />
                <AddNodeDialog />
                <AddEdgeDialog />
                <NodeDataSheetDialog />
                <EdgeDataSheetDialog />
                <ExportDialog />
            </div>
        );
    }
}
