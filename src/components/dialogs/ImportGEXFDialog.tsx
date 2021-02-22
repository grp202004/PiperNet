/* eslint-disable jsx-a11y/label-has-for */
import React from "react";
import {
    Button,
    Classes,
    Dialog,
    FileInput,
    Intent,
    Spinner,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";

export default observer(
    class ImportGEXFDialog extends React.Component {
        state = {
            fileIsSelect: false,
        };

        renderImportButton() {
            return (
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button
                            className={classnames({
                                [Classes.DISABLED]: !this.state.fileIsSelect,
                            })}
                            intent={Intent.PRIMARY}
                            onClick={() => {
                                State.import.isLoading = true;
                                State.import
                                    .importGraphFromGEXF()
                                    .then((res) => {
                                        State.graph.rawGraph = State.graph.decorateRawGraph(
                                            res.graph
                                        );
                                        State.graph.metadata = res.metadata;

                                        State.import.isLoading = false;
                                        State.import.importGEXFDialogOpen = false;
                                    });
                            }}
                            text="Import"
                        />
                    </div>
                </div>
            );
        }

        render() {
            return (
                <Dialog
                    icon="import"
                    className={classnames({
                        [Classes.DARK]: State.preferences.darkMode,
                    })}
                    isOpen={State.import.importGEXFDialogOpen}
                    onClose={() => {
                        State.import.importGEXFDialogOpen = false;
                    }}
                    title="Import GEXF"
                >
                    {/* if is loading, then show Spinner */}
                    {State.import.isLoading ? (
                        <Spinner />
                    ) : (
                        <div
                            className={classnames(
                                Classes.DIALOG_BODY,
                                "import-dialog"
                            )}
                        >
                            <div>
                                <div
                                    className={classnames(
                                        Classes.CONTROL_GROUP
                                    )}
                                >
                                    <div
                                        className={classnames(
                                            Classes.INPUT_GROUP,
                                            Classes.FILL
                                        )}
                                    >
                                        <FileInput
                                            text={State.import.gexfFileName}
                                            onInputChange={(event) => {
                                                let target = event.target as HTMLInputElement;
                                                if (
                                                    !target.files ||
                                                    target.files.length < 1
                                                ) {
                                                    return;
                                                }
                                                State.import.gexfFileName =
                                                    target.files[0].name;
                                                // after setting the selectedNodeFileFromInput, it will auto render the preview table
                                                State.import.selectedGEXFFileFromInput =
                                                    target.files[0];

                                                this.setState({
                                                    fileIsSelect: true,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {this.renderImportButton()}
                        </div>
                    )}
                </Dialog>
            );
        }
    }
);