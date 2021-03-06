import React from "react";
import { Classes, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import { computed, makeObservable } from "mobx";

interface Props {
    /**
     * what place this RightClick interaction is activated
     *
     * @type {("Node" | "Cluster" | "Background")}
     */
    on: "Node" | "Cluster" | "Background";
}

export default observer(
    class RightClickPanel extends React.Component<Props, {}> {
        constructor(props: any) {
            super(props);
            makeObservable(this, {
                stylePosition: computed,
            });
        }

        get stylePosition() {
            return {
                top: State.preferences.rightClickPositionY + 10 + "px",
                left: State.preferences.rightClickPositionX + 10 + "px",
            };
        }

        renderNodeMenu() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuDivider
                        title={
                            ("Node ID: " +
                                State.interaction
                                    .currentlyHoveredNodeId) as string
                        }
                    />
                    <MenuItem
                        icon="graph-remove"
                        text="Delete Node"
                        onClick={() => {
                            State.graph.mutating.dropNode(
                                State.interaction
                                    .currentlyHoveredNodeId as string
                            );
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                    <MenuItem
                        icon="new-link"
                        text="Add Edge"
                        onClick={() => {
                            State.preferences.AddEdgeDialogOpen = true;
                        }}
                    />
                    <MenuItem
                        icon="cross"
                        text="Delete Edge"
                        onClick={() => {
                            State.preferences.deleteEdgePanelOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                </Menu>
            );
        }

        renderClusterMenu() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuItem
                        icon="new-object"
                        text="Split Cluster"
                        onClick={() => {}}
                    />
                    <MenuItem
                        icon="group-objects"
                        text="Merge Cluster"
                        onClick={() => {}}
                    />
                    <MenuDivider />
                </Menu>
            );
        }

        renderBackgroundMenu() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuItem
                        icon="new-object"
                        text="Add Node"
                        onClick={() => {
                            State.preferences.AddNodeDialogOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuItem
                        icon="group-objects"
                        text="Add Node"
                        onClick={() => {
                            State.preferences.AddNodeDialogOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                </Menu>
            );
        }

        render() {
            if (this.props.on === "Node") {
                return this.renderNodeMenu();
            } else if (this.props.on === "Cluster") {
                return this.renderClusterMenu();
            } else if (this.props.on === "Background") {
                return this.renderBackgroundMenu();
            }
        }
    }
);
