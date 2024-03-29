/* eslint-disable jsx-a11y/label-has-for */
import React from "react";
import {
    Button,
    ButtonGroup,
    Classes,
    ControlGroup,
    Dialog,
    FileInput,
    Intent,
    Spinner,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";

export default observer(
    /**
     * @description the dialog for GEXF import
     * @author Zichen XU
     * @class ImportGEXFDialog
     * @extends {React.Component}
     */
    class ImportGEXFDialog extends React.Component {
        state = {
            fileIsSelect: false,
        };

        renderImportButton() {
            return (
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <ButtonGroup>
                            <Button
                                disabled={!this.state.fileIsSelect}
                                intent={Intent.PRIMARY}
                                onClick={() => {
                                    State.import.isLoading = true;
                                    State.import
                                        .importGraphFromGEXF()
                                        .then((res) => {
                                            State.graph.setGraph(
                                                res.graph,
                                                res.metadata
                                            );

                                            if (
                                                State.graph.rawGraph.hasAttribute(
                                                    "default"
                                                )
                                            ) {
                                                State.cluster.setCluster(
                                                    State.graph.rawGraph.getAttribute(
                                                        "default"
                                                    )
                                                );
                                            }

                                            State.import.isLoading = false;
                                            State.import.importGEXFDialogOpen = false;
                                        });
                                }}
                                text="Import"
                            />
                        </ButtonGroup>
                    </div>
                </div>
            );
        }

        render() {
            return (
                <Dialog
                    icon="document-open"
                    isOpen={State.import.importGEXFDialogOpen}
                    onClose={() => {
                        State.import.importGEXFDialogOpen = false;
                    }}
                    title="Open GEXF"
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
                                <ControlGroup>
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
                                </ControlGroup>
                            </div>
                            {this.renderImportButton()}
                        </div>
                    )}
                </Dialog>
            );
        }
    }
);
