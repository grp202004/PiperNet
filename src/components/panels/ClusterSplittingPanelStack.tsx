import React, { useCallback, useState } from "react";

import {
    Button,
    Intent,
    Panel,
    PanelProps,
    PanelStack2,
    Classes,
    H4,
    Callout,
} from "@blueprintjs/core";
import { Popover2, Tooltip2 } from "@blueprintjs/labs";
import classnames from "classnames";
import State from "../../state";
import { VisualizationMode } from "../../state/PreferencesStore";

interface CustomPanelEntry {
    title: string;
    component: JSX.Element;
}

const allPanelStacks = [
    {
        title: "Select Cluster",
        component: (
            <p>
                Select a <b>Cluster</b> to split by clicking it
            </p>
        ),
    } as CustomPanelEntry,
    {
        title: "Draw Line",
        component: (
            <p>
                Use the mouse to <b>hold and draw a line </b> to split this
                Cluster
            </p>
        ),
    } as CustomPanelEntry,
    {
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
                            // State.clusterInteraction.confirmClusterSplittingOpen = false;
                            State.clusterInteraction.confirmClusterSplittingTempData = null;
                            State.interaction.flush();
                            State.preferences.visualizationMode =
                                VisualizationMode.Normal;
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        intent="primary"
                        small={true}
                        onClick={() => {
                            // State.clusterInteraction.confirmClusterSplittingOpen = false;
                            State.clusterInteraction.splitCluster();
                            State.interaction.flush();
                            State.preferences.visualizationMode =
                                VisualizationMode.Normal;
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

const customPanelRenderer = (props: PanelProps<PanelInfo>) => {
    return <Callout>{allPanelStacks[props.panelNumber - 1].component}</Callout>;
};

const CustomPanel: React.FC<PanelProps<PanelInfo>> = (props) => {
    return customPanelRenderer(props);
};

const initialPanel: Panel<PanelInfo> = {
    props: {
        panelNumber: 1,
    },
    renderPanel: CustomPanel,
    title: allPanelStacks[0].title,
};

let ClusterSplittingPanelStack: React.FC = (props) => {
    const [currentPanelStack, setCurrentPanelStack] = useState([initialPanel]);
    const addToPanelStack = useCallback(
        (newPanel: Panel<PanelInfo>) =>
            setCurrentPanelStack((stack) => [...stack, newPanel]),
        []
    );
    const removeFromPanelStack = useCallback(
        (_lastPanel: Panel<PanelInfo>) =>
            setCurrentPanelStack((stack) =>
                stack.length === 1 ? stack : stack.slice(0, stack.length - 1)
            ),
        []
    );
    return (
        <Popover2
            usePortal={false}
            content={
                <div style={{ width: "300px" }}>
                    <Button
                        icon="cross"
                        minimal={true}
                        onClick={() => {
                            State.preferences.clusterSplittingPanelStackOpen = false;
                        }}
                    ></Button>
                    <Button
                        icon="chevron-left"
                        minimal={true}
                        onClick={() => {
                            removeFromPanelStack(
                                currentPanelStack[currentPanelStack.length - 1]
                            );
                        }}
                    ></Button>
                    <Button
                        icon="chevron-right"
                        minimal={true}
                        onClick={() => {
                            if (
                                currentPanelStack.length ===
                                allPanelStacks.length
                            ) {
                                return;
                            }
                            addToPanelStack({
                                props: {
                                    panelNumber: currentPanelStack.length + 1,
                                },
                                renderPanel: CustomPanel,
                                title:
                                    allPanelStacks[currentPanelStack.length]
                                        .title,
                            });
                        }}
                    ></Button>
                    <PanelStack2
                        initialPanel={currentPanelStack[0]}
                        onOpen={addToPanelStack}
                        onClose={removeFromPanelStack}
                        renderActivePanelOnly={true}
                        stack={currentPanelStack}
                    />
                </div>
            }
            defaultIsOpen={false}
            isOpen={State.preferences.clusterSplittingPanelStackOpen}
        >
            <Tooltip2 usePortal={false} content={Intent.DANGER}>
                <Button
                    className={classnames([Classes.BUTTON, Classes.MINIMAL])}
                    intent={Intent.DANGER}
                    text={VisualizationMode.ClusterSplitting}
                    active={
                        State.preferences.visualizationMode ===
                        VisualizationMode.ClusterSplitting
                    }
                    onClick={() => {
                        State.preferences.visualizationMode =
                            VisualizationMode.ClusterSplitting;
                    }}
                />
            </Tooltip2>
        </Popover2>
    );
};

export default ClusterSplittingPanelStack;
