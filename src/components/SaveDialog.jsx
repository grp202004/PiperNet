import React from "react";
import {
    Button,
    Classes,
    Card,
    Icon,
    Dialog,
    Intent,
    Spinner,
    Elevation,
    Divider,
    H3,
    ButtonGroup,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../state";

export default observer(
    class SaveSnapshotDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                ready: true,
            };
        }

        render() {
            return (
                <Dialog
                    iconName="projects"
                    isOpen={State.project.exportDialogOpen}
                    onClose={() => {
                        State.project.exportDialogOpen = false;
                    }}
                    title={`Export Graph`}
                >
                    {!this.state.ready ? (
                        <Spinner />
                    ) : (
                        <div className={classnames(Classes.DIALOG_BODY)}>
                            <Card interactive={false} elevation={Elevation.ONE}>
                                <H3>
                                    GEXF Export{" "}
                                    <Button
                                        icon="help"
                                        minimal={true}
                                        onClick={() => {
                                            window.open(
                                                "https://gephi.org/gexf/format/"
                                            );
                                        }}
                                    />
                                </H3>
                                <Divider />
                                <Button
                                    onClick={() => {
                                        // do something
                                    }}
                                >
                                    Download GEXF File
                                </Button>
                            </Card>
                            <br></br>
                            <Card interactive={false} elevation={Elevation.ONE}>
                                <H3>
                                    CSV Export{" "}
                                    <Button
                                        icon="help"
                                        minimal={true}
                                        onClick={() => {
                                            window.open(
                                                "https://github.com/grp202004/PiperNet#data-import"
                                            );
                                        }}
                                    />
                                </H3>

                                <Divider />
                                <ButtonGroup>
                                    <Button
                                        onClick={() => {
                                            // do something
                                        }}
                                    >
                                        Download Node File
                                    </Button>
                                    <Divider />
                                    <Button
                                        onClick={() => {
                                            // do something
                                        }}
                                    >
                                        Download Edge File
                                    </Button>
                                </ButtonGroup>
                            </Card>
                        </div>
                    )}
                </Dialog>
            );
        }
    }
);
