import React from "react";
// import PreferencesDialog from "./PreferencesDialog";
import ImportCSVDialog from "./dialogs/ImportCSVDialog";
import ImportGEXFDialog from "./dialogs/ImportGEXFDialog";
import ImportSamplesDialog from "./dialogs/ImportGEXFDialog";
import ExportDialog from "./dialogs/ExportDialog";
// import ProjectDetailDialog from "./ProjectDetailDialog";
// import RenameSnapshotDialog from "./RenameSnapshotDialog";
// import StatisticsDialog from './StatisticsDialog';
// import HelpDialog from './HelpDialog';
// import NeighborDialog from './NeighborDialog';
import NodeDataSheetDialog from "./dialogs/NodeDataSheetDialog";
import EdgeDataSheetDialog from "./dialogs/EdgeDataSheetDialog";
import AddNodeDialog from "./dialogs/AddNodeDialog";

export default class Dialogs extends React.Component {
    render() {
        return (
            <div style={{ display: "none" }}>
                {/* <PreferencesDialog /> */}
                <ImportCSVDialog />
                <ImportGEXFDialog />
                <ImportSamplesDialog />
                {/*
                <ProjectDetailDialog />
                <RenameSnapshotDialog />
                <StatisticsDialog />
                <HelpDialog />
                <NeighborDialog />\
                */}
                <NodeDataSheetDialog />
                <EdgeDataSheetDialog />
                <ExportDialog />
                <AddNodeDialog />
            </div>
        );
    }
}
