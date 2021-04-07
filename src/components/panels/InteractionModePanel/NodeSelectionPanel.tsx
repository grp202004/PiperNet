import React from "react";

import { Button, Intent, Classes, Card, Text } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import classnames from "classnames";
import State from "../../../state";
import { VisualizationMode } from "../../../state/PreferencesStore";
import { observer } from "mobx-react";
import { getMessage } from "./InteractionModePanel";

export default observer(
    /**
     * @description a helper pop-over that user can choose to enter the box-selection mode
     * @author Zichen XU
     * @class NodeSelectionPanel
     * @extends {React.Component}
     */
    class NodeSelectionPanel extends React.Component {
        private renderPanelStack = () => {
            return (
                <div
                    className={Classes.PANEL_STACK_VIEW}
                    style={{ position: "unset" }}
                >
                    <div style={{ minWidth: "300px", minHeight: "100px" }}>
                        <div className={Classes.PANEL_STACK_HEADER}>
                            <span />
                            <Text className={Classes.HEADING} ellipsize={true}>
                                Node Multi-Selection Mode
                            </Text>
                            <span />
                        </div>
                        <Card>
                            <Button
                                icon="select"
                                intent={
                                    State.interaction.boxSelectionOpen
                                        ? Intent.PRIMARY
                                        : Intent.NONE
                                }
                                active={State.interaction.boxSelectionOpen}
                                onClick={() =>
                                    (State.interaction.boxSelectionOpen = !State
                                        .interaction.boxSelectionOpen)
                                }
                            >
                                Use Box-Selection
                            </Button>
                        </Card>
                    </div>
                    <Button
                        icon="cross"
                        style={{
                            position: "absolute",
                            top: -1,
                            right: -1,
                            zIndex: 99,
                        }}
                        minimal={true}
                        onClick={() => {
                            State.helper.NodeSelectionPanelOpen = false;
                        }}
                    />
                </div>
            );
        };

        render() {
            return (
                <Popover2
                    placement="right"
                    usePortal={false}
                    content={this.renderPanelStack()}
                    isOpen={
                        State.preferences.visualizationMode ===
                            VisualizationMode.NodeSelection &&
                        State.helper.NodeSelectionPanelOpen
                    }
                >
                    <Tooltip2
                        usePortal={false}
                        content={getMessage(VisualizationMode.NodeSelection)}
                    >
                        <Button
                            className={classnames([
                                Classes.BUTTON,
                                Classes.MINIMAL,
                            ])}
                            intent={Intent.WARNING}
                            text={VisualizationMode.NodeSelection}
                            active={
                                State.preferences.visualizationMode ===
                                VisualizationMode.NodeSelection
                            }
                            onClick={() => {
                                State.preferences.visualizationMode =
                                    VisualizationMode.NodeSelection;

                                State.helper.NodeSelectionPanelOpen = true;
                            }}
                        />
                    </Tooltip2>
                </Popover2>
            );
        }
    }
);
