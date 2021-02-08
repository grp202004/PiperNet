import React, { Attributes } from "react";
import {
    Menu,
    MenuItem,
    MenuDivider,
    Classes,
    Button,
    Alert,
    Code,
    Intent,
    Card,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import {
    Table,
    RenderMode,
    Column,
    Cell,
    ICellRenderer,
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
        constructor(props: any) {
            super(props);
        }

        state = {
            edgeToDelete: "",
            deleteAlertOpen: false,
        };

        get neighbors(): string[] {
            if (this.props.onNode == "") {
                return [];
            }
            let neighbors: string[] = [];
            State.graph.rawGraph.forEachNeighbor(
                this.props.onNode,
                (neighbor) => {
                    neighbors.push(neighbor);
                }
            );
            return neighbors;
        }

        deleteEdgeRenderer: ICellRenderer = (rowIndex) => {
            let targetNode = this.neighbors[rowIndex];
            let edgeKey = State.graph.rawGraph.edge(
                this.props.onNode,
                targetNode
            );
            return (
                <Cell>
                    <Button
                        onClick={() => {
                            this.setState({
                                edgeToDelete: edgeKey as string,
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
            if (this.state.edgeToDelete == "") {
                return null;
            }
            let source = State.graph.rawGraph.source(this.state.edgeToDelete);
            let target = State.graph.rawGraph.target(this.state.edgeToDelete);

            return (
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Confirm Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.deleteAlertOpen}
                    onCancel={() => this.setState({ deleteAlertOpen: false })}
                    onConfirm={() => {
                        State.graph.rawGraph.dropEdge(this.state.edgeToDelete);
                        this.setState({ deleteAlertOpen: false });
                    }}
                >
                    <p>
                        Are you sure you want to delete the edge with ID{" "}
                        <Code>{this.state.edgeToDelete}</Code> between Node ID{" "}
                        <Code>{source}</Code> and Node ID <Code>{target}</Code>.
                        This action cannot be reversed.
                    </p>
                </Alert>
            );
        };

        neighborsRenderer: ICellRenderer = (rowIndex: number) => {
            return (
                <Cell interactive={true}>
                    <div
                        onClick={() => {
                            State.graphDelegate.cameraFocusOn(
                                this.props.onNode,
                                400
                            );
                            State.graphDelegate.highlightLink = {
                                source: this.props.onNode,
                                target: this.neighbors[rowIndex],
                            };
                            State.graphDelegate.graphDelegateMethods.refresh(); // update color of selected edges
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
                                State.graphDelegate.highlightLink = null;
                                State.graphDelegate.graphDelegateMethods.refresh(); // update color of selected edges
                            }}
                        >
                            Close
                        </Button>
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
