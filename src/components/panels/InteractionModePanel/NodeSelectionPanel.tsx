import React from "react";

import {
    Button,
    Intent,
    Panel,
    PanelProps,
    PanelStack2,
    Classes,
    H4,
    Callout,
    RadioGroup,
    Radio,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/labs";
import classnames from "classnames";
import State from "../../../state";
import { VisualizationMode } from "../../../state/PreferencesStore";
import { observer } from "mobx-react";
import ComponentRef from "../../ComponentRef";

export default observer(
    class NodeSelectionPanel extends React.Component {
        handleChange = () => {
            State.interaction.boxSelectionOpen = !State.interaction
                .boxSelectionOpen;
        };
        private renderPanelStack = () => {
            return (
                <div
                    style={{ width: "300px", height: "100px", display: "flex" }}
                >
                    <Button
                        icon="cross"
                        minimal={true}
                        onClick={() => {
                            State.helper.NodeSelectionPanelOpen = false;
                        }}
                    ></Button>
                    <RadioGroup
                        label="Node Multi-Selection Mode"
                        onChange={this.handleChange}
                        selectedValue={
                            State.interaction.boxSelectionOpen ? "two" : "one"
                        }
                    >
                        <Radio label="Click" value="one" />
                        <Radio label="Box-Selection" value="two" />
                    </RadioGroup>
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
                        content={VisualizationMode.NodeSelection}
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
