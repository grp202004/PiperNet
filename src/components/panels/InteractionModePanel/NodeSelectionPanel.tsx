import React from "react";

import { Button, Intent, Classes, RadioGroup, Radio } from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/labs";
import classnames from "classnames";
import State from "../../../state";
import { VisualizationMode } from "../../../state/PreferencesStore";
import { observer } from "mobx-react";
import { getMessage } from "./InteractionModePanel";

export default observer(
    class NodeSelectionPanel extends React.Component {
        handleChange = () => {
            State.interaction.boxSelectionOpen = !State.interaction
                .boxSelectionOpen;
        };
        private renderPanelStack = () => {
            return (
                <div style={{ width: "300px", height: "100px" }}>
                    <div style={{ marginLeft: 20 }}>
                        <RadioGroup
                            label="Node Multi-Selection Mode"
                            onChange={this.handleChange}
                            selectedValue={
                                State.interaction.boxSelectionOpen
                                    ? "two"
                                    : "one"
                            }
                        >
                            <Radio label="Click" value="one" />
                            <Radio label="Box-Selection" value="two" />
                        </RadioGroup>
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
