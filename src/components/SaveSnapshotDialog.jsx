import React from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    ButtonGroup,
    NumericInput,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../state";
import GraphDataTable from "./GraphDataTable";
import SimpleSelect from "./utils/SimpleSelect";

export default observer(
    class SaveSnapshotDialog extends React.Component {

        render() {
            return (
                <Dialog
                    iconName="database"
                    isOpen={State.project.saveSnapshotDialogOpen}
                    onClose={() => {
                        State.project.saveSnapshotDialogOpen = false;
                    }}
                    title="Snapshot"
                    style={{ minWidth: "80vw" }}
                >


                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                intent={Intent.PRIMARY}
                                // onClick={() => {
                                //     State.preferences.dataSheetDialogOpen = false;
                                // }}
                                text="export as csv"
                            />
                        </div>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                intent={Intent.PRIMARY}
                                // onClick={() => {
                                //     State.preferences.dataSheetDialogOpen = false;
                                // }}
                                text="export as gexf"
                            />
                        </div>
                    </div>
                </Dialog>
            );
        }
    }
);