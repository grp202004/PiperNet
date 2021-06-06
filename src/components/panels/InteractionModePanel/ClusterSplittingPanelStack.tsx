import React from "react";

import {
    Button,
    Intent,
    Classes,
    H4,
    RadioGroup,
    Radio,
    Text,
    Card,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/popover2";
import classnames from "classnames";
import State from "../../../state";
import { VisualizationMode } from "../../../state/PreferencesStore";
import { observer } from "mobx-react";
import ComponentRef from "../../ComponentRef";
import { getMessage } from "./InteractionModePanel";
import { handleStringChange } from "../../utils/InputFormUtils";
import { DrawMode } from "../../../state/ClusterInteractionStore";
import FormTwoClusterOptionsCard from "../../utils/FormTwoClusterOptionsCard";

interface Props {
    currentStep: 1 | 2 | 3;
}

export default observer(
    /**
     * @description the helper pop-over for a step-to-step guidance to user on the way to split cluster
     * @author Zichen XU
     * @class ClusterSplittingPanelStack
     * @extends {React.Component<Props, {}>}
     */
    class ClusterSplittingPanelStack extends React.Component<Props, {}> {
        state = {
            selected: "curve" as string,
        };
        titles = ["Select Cluster", "Draw Line or Circle", "Confirm?"];

        renderFirstPanel = () => {
            return (
                <p>
                    Select a <b>Cluster</b> to split by clicking it
                </p>
            );
        };

        renderSecondPanel = () => {
            return (
                <p>
                    <RadioGroup
                        label="Use the mouse to"
                        onChange={handleStringChange((value) => {
                            this.setState({ selected: value });
                            switch (value) {
                                case "curve":
                                    State.clusterInteraction.drawMode =
                                        DrawMode.FreeLine;
                                    break;
                                case "straight":
                                    State.clusterInteraction.drawMode =
                                        DrawMode.StraightLine;
                                    break;
                                case "circle":
                                    State.clusterInteraction.drawMode =
                                        DrawMode.FreeCircle;
                                    break;
                                case "centerCircle":
                                    State.clusterInteraction.drawMode =
                                        DrawMode.CenterCircle;
                                    break;
                            }
                        })}
                        selectedValue={this.state.selected}
                    >
                        <Radio
                            label="Draw a Freehand Line through the cluster"
                            value="curve"
                        />
                        <Radio
                            label="Draw a Straight Line through the cluster"
                            value="straight"
                        />
                        <Radio
                            label="Draw a Free Circle within the cluster"
                            value="circle"
                        />
                        <Radio
                            label="Draw a Centered Circle within the cluster"
                            value="centerCircle"
                        />
                    </RadioGroup>
                    hold and draw a line to split this Cluster
                </p>
            );
        };

        renderThirdPanel = () => {
            return (
                <div style={{ width: "500px" }}>
                    <H4>Confirm Splitting of Cluster? </H4>
                    <p>
                        The two sub-clusters has been specified using the
                        different node colors.
                    </p>
                    <FormTwoClusterOptionsCard
                        callback={(
                            attribute: string,
                            value1: number | string,
                            value2: number | string
                        ) => {
                            State.helper.clusterSplittingPanelStackOpen = false;
                            State.clusterInteraction.splitCluster(
                                attribute,
                                value1,
                                value2
                            );
                            State.preferences.visualizationMode =
                                VisualizationMode.Normal;
                            State.helper.clusterSplittingCurrentStep = 1;
                        }}
                    />
                </div>
            );
        };

        renderWhichPanel = () => {
            switch (this.props.currentStep) {
                case 1:
                    return this.renderFirstPanel();
                case 2:
                    return this.renderSecondPanel();
                case 3:
                    return this.renderThirdPanel();
            }
        };

        renderWhichBack = () => {
            switch (this.props.currentStep) {
                case 1:
                    return <span />;
                case 2:
                    return (
                        <Button
                            className={Classes.PANEL_STACK_HEADER_BACK}
                            icon="chevron-left"
                            minimal={true}
                            onClick={() => {
                                State.helper.clusterSplittingCurrentStep = 1;
                            }}
                            small={true}
                            text={this.titles[0]}
                            title={this.titles[0]}
                        />
                    );
                case 3:
                    return (
                        <Button
                            className={Classes.PANEL_STACK_HEADER_BACK}
                            icon="chevron-left"
                            minimal={true}
                            onClick={() => {
                                State.helper.clusterSplittingCurrentStep = 2;
                            }}
                            small={true}
                            text={this.titles[1]}
                            title={this.titles[1]}
                        />
                    );
            }
        };

        renderPanelStack = () => {
            return (
                <div
                    className={Classes.PANEL_STACK_VIEW}
                    style={{ position: "unset" }}
                >
                    <div style={{ minWidth: "300px", minHeight: "100px" }}>
                        <div className={Classes.PANEL_STACK_HEADER}>
                            {this.renderWhichBack()}
                            <Text className={Classes.HEADING} ellipsize={true}>
                                {this.titles[this.props.currentStep - 1]}
                            </Text>
                            <span />
                        </div>
                        <Card> {this.renderWhichPanel()}</Card>
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
                        placement={"bottom"}
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
