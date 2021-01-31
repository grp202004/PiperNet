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
import DataSheetDialog from "./dialogs/DataSheetDialog";

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
                <DataSheetDialog />
                <ExportDialog />
            </div>
        );
    }
}
