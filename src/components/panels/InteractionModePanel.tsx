import React from "react";
import { Button, Classes, Intent, Position } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import { VisualizationMode } from "../../state/PreferencesStore";
import ClusterSplittingPanelStack from "./ClusterSplittingPanelStack";
import { Tooltip2 } from "@blueprintjs/popover2";

export default observer(
    class InteractionModePanel extends React.Component {
        getIntent(mode: VisualizationMode) {
            switch (mode) {
                case VisualizationMode.Normal:
                    return Intent.PRIMARY;

                case VisualizationMode.NodeSelection:
                    return Intent.WARNING;

                case VisualizationMode.ClusterSelection:
                    return Intent.SUCCESS;

                case VisualizationMode.ClusterSplitting:
                    return Intent.DANGER;
            }
        }

        renderMode(mode: VisualizationMode) {
            return (
                <Tooltip2 content={mode}>
                    <Button
                        className={classnames([
                            Classes.BUTTON,
                            Classes.MINIMAL,
                        ])}
                        text={mode}
                        intent={this.getIntent(mode)}
                        active={State.preferences.visualizationMode === mode}
                        onClick={() => {
                            State.preferences.visualizationMode = mode;
                        }}
                    />
                </Tooltip2>
            );
        }

        render() {
            return (
                <div className="selection-action-panel">
                    {this.renderMode(VisualizationMode.Normal)}
                    {this.renderMode(VisualizationMode.NodeSelection)}
                    {this.renderMode(VisualizationMode.ClusterSelection)}
                    <ClusterSplittingPanelStack
                        currentStep={State.helper.clusterSplittingCurrentStep}
                    />
                </div>
            );
        }
    }
);
