import React from "react";
import { Button, Classes, Intent } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../../state";
import { VisualizationMode } from "../../../state/PreferencesStore";
import ClusterSplittingPanelStack from "./ClusterSplittingPanelStack";
import { Tooltip2 } from "@blueprintjs/popover2";
import NodeSelectionPanel from "./NodeSelectionPanel";

export function getMessage(mode: VisualizationMode): string {
    switch (mode) {
        case VisualizationMode.Normal:
            return "Normal Interaction Mode where mouse interactions on nodes and clusters are both activated";

        case VisualizationMode.NodeSelection:
            return "Select one or more nodes and interact with them, such as adding/deleting, merge them to a cluster, free them from a cluster";

        case VisualizationMode.ClusterSelection:
            return "Select one or more clusters and interact with them, such as merging and releasing them";

        case VisualizationMode.ClusterSplitting:
            return "Select one cluster and draw a line to split into two halfs";
    }
}

export default observer(
    /**
     * @description the four panels to select from different interaction modes
     * @author Zichen XU
     * @class InteractionModePanel
     * @extends {React.Component}
     */
    class InteractionModePanel extends React.Component {
        getIntent(mode: VisualizationMode): Intent {
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
                <Tooltip2 content={getMessage(mode)}>
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
                    <NodeSelectionPanel />
                    {this.renderMode(VisualizationMode.ClusterSelection)}
                    <ClusterSplittingPanelStack
                        currentStep={State.helper.clusterSplittingCurrentStep}
                    />
                </div>
            );
        }
    }
);
