import React from "react";
import {
    Alert,
    Button,
    ButtonGroup,
    Callout,
    Classes,
    Code,
    Dialog,
    Divider,
    InputGroup,
    Intent,
} from "@blueprintjs/core";
import {
    Cell,
    Column,
    ICellRenderer,
    RenderMode,
    Table,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";
import { Attributes, SerializedEdge } from "graphology-types";
import { handleStringChange } from "../utils/InputFormUtils";
import NodeChooser from "../utils/NodeChooser";
export default observer(
    class AddEdgeDialog extends React.Component {
        state = {
            // addEdgeDialogOpen: false,
            // deleteAlertOpen: false,
            // edgeToDelete: null as null | SerializedEdge<Attributes>,
            // filterQuery: null as null | string,
            chosenSource: null as null | string,
            chosenTarget: null as null | string,
        };

        get canImport(): boolean {
            if (!this.state.chosenSource || !this.state.chosenTarget) {
                return false;
            } else if (this.state.chosenSource === this.state.chosenTarget) {
                return false;
            } else {
                return (
                    !State.graph.rawGraph.hasEdge(
                        this.state.chosenSource,
                        this.state.chosenTarget
                    ) &&
                    !State.graph.rawGraph.hasEdge(
                        this.state.chosenTarget,
                        this.state.chosenSource
                    )
                );
            }
        }

        render() {
            return (
                <Dialog
                    isOpen={State.preferences.AddEdgeDialogOpen}
                    icon="new-link"
                    onClose={() => {
                        State.preferences.AddEdgeDialogOpen = false;
                    }}
                    onClosed={() =>
                        this.setState({
                            chosenSource: null,
                            chosenTarget: null,
                        })
                    }
                    title="Add Edge"
                >
                    <div className={Classes.DIALOG_BODY}>
                        <p>
                            <strong>
                                You can only add unique undirected edges to the
                                graph dataset.
                            </strong>
                        </p>
                        <p>
                            A <em>UNIQUE</em> edge means there should only exist
                            one edge that connects between the source and the
                            target.
                        </p>
                        <ButtonGroup fill={true}>
                            <NodeChooser
                                text="Source Node"
                                onChange={(value) => {
                                    this.setState({ chosenSource: value });
                                }}
                            />
                            <Divider />
                            <NodeChooser
                                text="Target Node"
                                onChange={(value) => {
                                    this.setState({ chosenTarget: value });
                                }}
                            />
                        </ButtonGroup>
                        <p>New edges are added to the end of the table.</p>
                        {!this.canImport && (
                            <Callout
                                title="Invalid Edge"
                                intent="danger"
                                icon="edit"
                            >
                                The new edge is invalid because either this is a
                                edge that already in the graph or cannot form a
                                valid undirected edge
                            </Callout>
                        )}
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                onClick={() => {
                                    State.preferences.AddEdgeDialogOpen = false;
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => {
                                    State.graph.mutating.addEdge(
                                        this.state.chosenSource!,
                                        this.state.chosenTarget!
                                    );
                                    this.forceUpdate();
                                    State.preferences.AddEdgeDialogOpen = false;
                                }}
                                disabled={!this.canImport}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Dialog>
            );
        }
    }
);
