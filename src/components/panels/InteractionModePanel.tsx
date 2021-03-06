import React from "react";
import { Button, Classes, Intent, Position, Tooltip } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import { VisualizationMode } from "../../state/NodeInteractionStore";
import { renderFilteredItems } from "@blueprintjs/select";

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
                <Tooltip content={mode} position={Position.BOTTOM}>
                    <Button
                        className={classnames([
                            Classes.BUTTON,
                            Classes.MINIMAL,
                        ])}
                        text={mode}
                        intent={this.getIntent(mode)}
                        active={State.interaction.visualizationMode === mode}
                        onClick={() => {
                            State.interaction.visualizationMode = mode;
                        }}
                    />
                </Tooltip>
            );
        }

        render() {
            return (
                <div className="selection-action-panel">
                    {this.renderMode(VisualizationMode.Normal)}
                    {this.renderMode(VisualizationMode.NodeSelection)}
                    {this.renderMode(VisualizationMode.ClusterSelection)}
                    {this.renderMode(VisualizationMode.ClusterSplitting)}
                </div>
            );
        }
    }
);
