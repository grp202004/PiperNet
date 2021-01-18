import React from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    ButtonGroup,
    NumericInput,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../state";
import GraphDataTable from "./GraphDataTable";
import SimpleSelect from "./utils/SimpleSelect";

export default observer(
    class DataSheetDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showMoreBy: "pagerank",
                showMoreNum: 5,
            };
        }

        render() {
            return (
                <Dialog
                    iconName="database"
                    isOpen={State.preferences.dataSheetDialogOpen}
                    onClose={() => {
                        State.preferences.dataSheetDialogOpen = false;
                    }}
                    title="Data Sheet"
                    style={{ minWidth: "80vw" }}
                >
                    <div className={classnames(Classes.DIALOG_BODY)}>
                        <GraphDataTable />
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => {
                                    State.preferences.dataSheetDialogOpen = false;
                                }}
                                text="Done"
                            />
                        </div>
                    </div>
                </Dialog>
            );
        }
    }
);
