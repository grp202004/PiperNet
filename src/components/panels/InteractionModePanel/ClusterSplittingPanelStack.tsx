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
import { getMessage } from "./InteractionModePanel";
import { handleStringChange } from "../../utils/InputFormUtils";

interface CustomPanelEntry {
    step: number;
    title: string;
    component: JSX.Element;
}

const allPanelStacks = [
    {
        step: 1,
        title: "Select Cluster",
        component: (
            <p>
                Select a <b>Cluster</b> to split by clicking it
            </p>
        ),
    } as CustomPanelEntry,
    {
        step: 2,
        title: "Draw Line",
        component: (
            <div
                style={{
                    display: "flex",
                }}
            >
                <p>
                    <RadioGroup
                        label="Use the mouse to"
                        onChange={handleStringChange((value) => {
                            if (value === "straight") {
                                State.clusterInteraction.drawStraightLine = true;
                            } else {
                                State.clusterInteraction.drawStraightLine = false;
                            }
                        })}
                        selectedValue={
                            State.clusterInteraction.drawStraightLine
                                ? "straight"
                                : "curve"
                        }
                    >
                        <Radio label="Draw a Curved Line" value="curve" />
                        <Radio label="Draw a Straight Line" value="straight" />
                    </RadioGroup>
                    hold and draw a line to split this Cluster
                </p>
                <div>
                    <Button
                        intent="danger"
                        small={true}
                        onClick={() => {
                            State.helper.clusterSplittingCurrentStep = 1;
                        }}
                    >
                        Back
                    </Button>
                </div>
            </div>
        ),
    } as CustomPanelEntry,
    {
        step: 3,
        title: "Confirm?",
        component: (
            <div>
                <H4>Confirm Splitting of Cluster? </H4>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        intent="danger"
                        small={true}
                        onClick={() => {
                            State.helper.clusterSplittingCurrentStep = 2;
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        intent="primary"
                        small={true}
                        onClick={() => {
                            State.helper.clusterSplittingPanelStackOpen = false;
                            State.clusterInteraction.splitCluster();
                            State.preferences.visualizationMode =
                                VisualizationMode.Normal;
                            State.helper.clusterSplittingCurrentStep = 1;
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        ),
    } as CustomPanelEntry,
];

interface PanelInfo {
    panelNumber: number;
}

const CustomPanel: React.FC<PanelProps<PanelInfo>> = (props) => {
    return <Callout>{allPanelStacks[props.panelNumber - 1].component}</Callout>;
};

interface Props {
    currentStep: 1 | 2 | 3;
}

export default observer(
    class ClusterSplittingPanelStack extends React.Component<Props, {}> {
        private firstPanel: Panel<PanelInfo> = {
            props: {
                panelNumber: 1,
            },
            renderPanel: CustomPanel,
            title: allPanelStacks[0].title,
        };

        private secondPanel: Panel<PanelInfo> = {
            props: {
                panelNumber: 2,
            },
            renderPanel: CustomPanel,
            title: allPanelStacks[1].title,
        };

        private thirdPanel: Panel<PanelInfo> = {
            props: {
                panelNumber: 3,
            },
            renderPanel: CustomPanel,
            title: allPanelStacks[2].title,
        };

        get currentPanelStack() {
            switch (State.helper.clusterSplittingCurrentStep) {
                case 1:
                    return [this.firstPanel];

                case 2:
                    return [this.firstPanel, this.secondPanel];

                case 3:
                    return [this.firstPanel, this.secondPanel, this.thirdPanel];
                default:
                    return [];
            }
        }

        private renderPanelStack = () => {
            return (
                <div style={{ width: "300px", height: "100px" }}>
                    <PanelStack2
                        initialPanel={this.firstPanel}
                        stack={this.currentPanelStack}
                    />
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
                            State.helper.clusterSplittingPanelStackOpen = false;
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
                            VisualizationMode.ClusterSplitting &&
                        State.helper.clusterSplittingPanelStackOpen
                    }
                    onOpened={() => {
                        State.helper.clusterSplittingCurrentStep = 1;
                    }}
                >
                    <Tooltip2
                        usePortal={false}
                        content={getMessage(VisualizationMode.ClusterSplitting)}
                    >
                        <Button
                            className={classnames([
                                Classes.BUTTON,
                                Classes.MINIMAL,
                            ])}
                            intent={Intent.DANGER}
                            text={VisualizationMode.ClusterSplitting}
                            active={
                                State.preferences.visualizationMode ===
                                VisualizationMode.ClusterSplitting
                            }
                            onClick={() => {
                                State.preferences.visualizationMode =
                                    VisualizationMode.ClusterSplitting;

                                State.helper.clusterSplittingPanelStackOpen = true;
                            }}
                        />
                    </Tooltip2>
                </Popover2>
            );
        }
        componentDidMount = () => {
            ComponentRef.clusterSplittingPanelStack = this;
        };
    }
);
