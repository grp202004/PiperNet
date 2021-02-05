import React, { RefObject } from "react";
import {
    Button,
    Classes,
    Dialog,
    Intent,
    Switch,
    Callout,
    Alert,
    Code,
    InputGroup,
    ButtonGroup,
    Divider,
    FormGroup,
    MenuItem,
    H4,
    Alignment,
    Tooltip,
    Position,
} from "@blueprintjs/core";
import {
    Column,
    Table,
    Cell,
    ICellRenderer,
    Regions,
    RenderMode,
} from "@blueprintjs/table";
import { observer } from "mobx-react";
import State from "../../state";
import DataSheetDialogWrapper from "../utils/DataSheetDialogWrapper";
import { Attributes, SerializedEdge, SerializedNode } from "graphology-types";
import { handleStringChange, previewNodeDetail } from "../utils/InputFormUtils";
import CommonItemRenderer from "../utils/CommonItemRenderer";
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import { INTENT_PRIMARY } from "@blueprintjs/core/lib/esm/common/classes";

let GraphEdgeTable = observer(
    class GraphEdgeTable extends React.Component {
        constructor(props: any) {
            super(props);
        }

        state = {
            addEdgeDialogOpen: false,
            deleteEdgeAlertOpen: false,
            edgeToDelete: null as SerializedEdge<Attributes> | null,
            filterQuery: "",
            chosenSource: "",
            chosenTarget: "",
        };

        get filteredTable() {
            let newTable: SerializedEdge<Attributes>[] = [];
            State.graph.rawGraph.export().edges.forEach((edge) => {
                if (
                    edge.source
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    edge.target
                        .toLocaleLowerCase()
                        .includes(this.state.filterQuery.toLocaleLowerCase()) ||
                    this.state.filterQuery == ""
                ) {
                    newTable.push(edge);
                }
            });
            return newTable;
        }

        deleteEdgeRenderer: ICellRenderer = (rowIndex) => {
            return (
                <Cell>
                    <Button
                        onClick={() => {
                            this.setState({
                                edgeToDelete: this.filteredTable[rowIndex],
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

        deleteEdge = () => {
            State.graph.rawGraph.dropEdge(
                this.state.edgeToDelete?.key as string
            );
        };

        deleteEdgeAlert = () => {
            return (
                <Alert
                    cancelButtonText="Cancel"
                    confirmButtonText="Confirm Delete"
                    icon="trash"
                    intent={Intent.DANGER}
                    isOpen={this.state.deleteEdgeAlertOpen}
                    onCancel={() => this.setState({ deleteAlertOpen: false })}
                    onConfirm={() => {
                        this.deleteEdge();
                        this.setState({ deleteAlertOpen: false });
                    }}
                >
                    <p>
                        Are you sure you want to delete the edge with ID{" "}
                        <Code>{this.state.edgeToDelete?.key}</Code> from Node ID{" "}
                        <Code>{this.state.edgeToDelete?.source}</Code> to Node
                        ID <Code>{this.state.edgeToDelete?.target}</Code>. This
                        action cannot be reversed.
                    </p>
                </Alert>
            );
        };

        addEdgeDialog = () => {
            return (
                <Dialog
                    isOpen={this.state.addEdgeDialogOpen}
                    icon="new-link"
                    onClose={() => this.setState({ addEdgeDialogOpen: false })}
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
                            <ChooseNodeInputGroup
                                text="Source Node"
                                onChange={(value) => {
                                    this.setState({ chosenSource: value });
                                }}
                            />
                            <Divider />
                            <ChooseNodeInputGroup
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
                                onClick={() =>
                                    this.setState({ addEdgeDialogOpen: false })
                                }
                            >
                                Cancel
                            </Button>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => {
                                    State.graph.rawGraph.addEdge(
                                        this.state.chosenSource,
                                        this.state.chosenTarget
                                    );
                                    this.setState({ addEdgeDialogOpen: false });
                                }}
                                disabled={!this.canImport}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </Dialog>
            );
        };

        get canImport(): boolean {
            if (
                this.state.chosenSource == "" ||
                this.state.chosenTarget == ""
            ) {
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

        style = {
            textAlign: "center",
        };

        render() {
            return (
                <div>
                    <ButtonGroup>
                        <Button
                            onClick={() => this.forceUpdate()}
                            icon="refresh"
                            intent="none"
                            text="Refresh"
                        />
                        <Button
                            onClick={() =>
                                this.setState({ addEdgeDialogOpen: true })
                            }
                            icon="new-link"
                            intent="primary"
                            text="Add Edge"
                        />
                        <Divider />
                        <InputGroup
                            asyncControl={true}
                            leftIcon="search"
                            onChange={handleStringChange((value) => {
                                this.setState({ filterQuery: value });
                            })}
                            placeholder="Search any Source or Target of a Node..."
                            value={this.state.filterQuery}
                        />
                    </ButtonGroup>

                    <hr />
                    <Table
                        className="argo-table"
                        numRows={this.filteredTable.length}
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
                            name="Source"
                            //@ts-ignore
                            intent={Intent.PRIMARY}
                            cellRenderer={(rowIndex) => {
                                return (
                                    <Cell>
                                        {this.filteredTable[rowIndex].source}
                                    </Cell>
                                );
                            }}
                        />
                        <Column
                            name="Target"
                            //@ts-ignore
                            intent={Intent.PRIMARY}
                            cellRenderer={(rowIndex) => {
                                return (
                                    <Cell>
                                        {this.filteredTable[rowIndex].target}
                                    </Cell>
                                );
                            }}
                        />
                    </Table>
                    {this.deleteEdgeAlert()}
                    {this.addEdgeDialog()}
                </div>
            );
        }
    }
);

interface Props {
    text: string;
    onChange: (value: string) => void;
}

// this component can be used to choose the node among all the nodes, with basic search filters available
// have to specify the text shown on it as well as the onChange function to call when a node is selected, as Props interface above
// feel free to use it :)

export let ChooseNodeInputGroup = observer(
    class ChooseNodeInputGroup extends React.Component<Props, {}> {
        constructor(props: any) {
            super(props);
        }

        state = {
            select: "Choose " + this.props.text,
        };

        render() {
            return (
                <FormGroup
                    label={this.props.text}
                    labelFor="text-input"
                    labelInfo="(required)"
                >
                    <Select
                        filterable={true}
                        items={State.graph.rawGraph.export().nodes}
                        itemPredicate={(
                            query: string,
                            item: SerializedNode<Attributes>
                        ) => {
                            return item.key.includes(query);
                        }}
                        itemRenderer={(item: SerializedNode<Attributes>) => {
                            return (
                                <Tooltip2
                                    content={previewNodeDetail(
                                        item.attributes ?? {}
                                    )}
                                >
                                    <MenuItem
                                        key={item.key}
                                        text={item.key}
                                        onClick={() => {
                                            let key = item.key;
                                            this.setState({ select: key });
                                            this.props.onChange(key);
                                        }}
                                    />
                                </Tooltip2>
                            );
                        }}
                        noResults={
                            <MenuItem disabled={true} text="No results." />
                        }
                        onItemSelect={() => {}}
                    >
                        <Button
                            text={this.state.select}
                            rightIcon="double-caret-vertical"
                        />
                    </Select>
                </FormGroup>
            );
        }
    }
);

export default observer(
    class EdgeDataSheetDialog extends React.Component {
        constructor(props: any) {
            super(props);
        }

        render() {
            return (
                <DataSheetDialogWrapper for="edge">
                    <GraphEdgeTable />
                </DataSheetDialogWrapper>
            );
        }
    }
);
