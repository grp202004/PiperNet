import React from "react";
import { Alert, Button, Card, Code, H6, Intent } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import {
    Cell,
    Column,
    ICellRenderer,
    RenderMode,
    Table,
} from "@blueprintjs/table";

interface Props {
    /**
     * the node id of the select node to delete Edge
     *
     * @type {string}
     * @memberof Props
     */
    onNode: string;
}

export default observer(
    class DeleteEdgeInteractionPanel extends React.Component<Props, {}> {
        state = {
            targetNode: null as string | null,
            deleteAlertOpen: false,
        };

        get neighbors(): string[] {
            return State.graph.rawGraph.neighbors(this.props.onNode);
        }

        deleteEdgeRenderer: ICellRenderer = (rowIndex) => {
            let targetNode = this.neighbors[rowIndex];
            return (
                <Cell>
                    <Button
                        onClick={() => {
                            this.setState({
                                targetNode: targetNode,
                                deleteAlertOpen: true,
                            });
                        }}
                        icon="trash"
                        intent="danger"
                        text="Delete"
                        minimal={true}
                    />
                </Cell>
            );
        };

        deleteEdgeAlert = () => {
            if (this.state.targetNode === null) {
                return null;
            }

            let edgeToDelete: string | undefined;

            if (
                (edgeToDelete = State.graph.rawGraph.edge(
                    this.state.targetNode,
                    this.props.onNode
                )) === undefined
            ) {
                edgeToDelete = State.graph.rawGraph.edge(
                    this.props.onNode,
                    this.state.targetNode
                );
            }

            return (
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Confirm Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.deleteAlertOpen}
                    onCancel={() => this.setState({ deleteAlertOpen: false })}
                    onConfirm={() => {
                        State.graph.mutating.dropEdge(edgeToDelete as string);
                        this.setState({ deleteAlertOpen: false });
                        State.preferences.deleteEdgePanelOpen = false;
                    }}
                >
                    <p>
                        Are you sure you want to delete the edge with Key{" "}
                        <Code>{edgeToDelete as string}</Code> between Node ID{" "}
                        <Code>{this.state.targetNode}</Code> and Node ID{" "}
                        <Code>{this.props.onNode}</Code>. This action cannot be
                        reversed.
                    </p>
                </Alert>
            );
        };

        neighborsRenderer: ICellRenderer = (rowIndex: number) => {
            return (
                <Cell interactive={true}>
                    <div
                        onMouseEnter={() => {
                            State.graphDelegate.cameraFocusOn(
                                this.props.onNode,
                                400
                            );
                            State.interaction.selectedEdge = State.interaction.getEdgeKey(
                                this.props.onNode,
                                this.neighbors[rowIndex]
                            ) as string;
                        }}
                    >
                        {this.neighbors[rowIndex]}
                    </div>
                </Cell>
            );
        };

        render() {
            return (
                <div
                    className={classnames(
                        "right-bottom-overlay-card",
                        "transparent-frame"
                    )}
                >
                    <Card className={classnames("node-details-table")}>
                        <Button
                            icon="cross"
                            onClick={() => {
                                State.preferences.deleteEdgePanelOpen = false;
                                State.interaction.selectedEdge = null;
                                State.graphDelegate.graphDelegateMethods.refresh(); // update color of selected edges
                            }}
                        >
                            Close
                        </Button>
                        <H6> Node ID: {this.props.onNode}</H6>
                        <Table
                            numRows={this.neighbors.length}
                            defaultRowHeight={30}
                            renderMode={RenderMode.NONE}
                        >
                            <Column
                                name=""
                                cellRenderer={this.deleteEdgeRenderer}
                                //@ts-ignore
                                style={this.style}
                            />
                            <Column
                                name="Node ID"
                                //@ts-ignore
                                intent={Intent.PRIMARY}
                                cellRenderer={this.neighborsRenderer}
                            />
                        </Table>
                        {this.deleteEdgeAlert()}
                    </Card>
                </div>
            );
        }
    }
);
