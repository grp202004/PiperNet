import React from "react";
import { Button, Classes } from "@blueprintjs/core";
import classnames from "classnames";
import { observer } from "mobx-react";
import State from "../state";
import NodeDetailPanel from "./panels/NodeDetailPanel";
import MultiDetailPanel from "./panels/MultiDetailPanel";
import SearchPanel from "./panels/SearchPanel";
import DeleteEdgeInteractionPanel from "./panels/DeleteEdgeInteractionPanel";
import GraphOptionsCard from "./panels/GraphOptionsCard";
import InteractionModePanel from "./panels/InteractionModePanel/InteractionModePanel";
import RightClickPanel from "./panels/RightClickPanel";

export default observer(
    class FloatingCards extends React.Component {
        optionsVisible = {
            left: "0em",
        };
        optionsInvisible = {
            left: "-2200em",
        };
        sideButtonVis = {
            marginLeft: "50px",
        };
        sideButtonInv = {
            marginLeft: "-15px",
        };
        toggleOptions = () => {
            State.preferences.graphOptionsCardOpen = !State.preferences
                .graphOptionsCardOpen;
        };
        render() {
            return (
                <div className="floating-overlay">
                    <div className="left-cards">
                        <div
                            className={classnames(
                                Classes.CARD,
                                Classes.ELEVATION_2,
                                "overlay-card",
                                "transparent-frame",
                                "left-cards"
                            )}
                            style={
                                State.preferences.graphOptionsCardOpen
                                    ? this.optionsVisible
                                    : this.optionsInvisible
                            }
                        >
                            <br />
                            <Button
                                className="openbtn2"
                                icon="chevron-left"
                                onClick={this.toggleOptions}
                            />
                            <br />
                            <GraphOptionsCard />
                        </div>
                        <div
                            className={classnames(
                                Classes.CARD,
                                Classes.ELEVATION_2,
                                "overlay-card",
                                "transparent-frame"
                            )}
                            style={{
                                width: "1em",
                                paddingTop: "1em",
                                paddingRight: "0.7em",
                                paddingBottom: "0.5em",
                                marginLeft: "-5.4em",
                            }}
                        >
                            <Button
                                icon="more"
                                className="openbtn"
                                onClick={this.toggleOptions}
                                style={
                                    State.preferences.graphOptionsCardOpen
                                        ? this.sideButtonInv
                                        : this.sideButtonVis
                                }
                            />
                        </div>
                    </div>

                    {/* single selected */}
                    {/* {State.graph.selectedNodes.length === 1 && (
                        <NodeDetail node={State.graph.currentlyHoveredId} />
                    )} */}
                    {State.interaction.currentlyHoveredNodeId &&
                        State.interaction.selectedNodes.length === 0 && (
                            <NodeDetailPanel
                                onNode={
                                    State.interaction.currentlyHoveredNodeId
                                }
                            />
                        )}

                    {/* multiple selected */}
                    {/* {State.graph.selectedNodes.length !== 1 && State.graph.currentlyHovered && (
                        <NodeDetail node={State.graph.currentlyHovered.data.ref} />
                    )} */}
                    {State.interaction.selectedNodes.length !== 0 && (
                        <MultiDetailPanel />
                    )}

                    <SearchPanel />
                    {State.preferences.rightClickPanelOpen &&
                        State.preferences.rightClickOn && (
                            <RightClickPanel
                                on={State.preferences.rightClickOn}
                            />
                        )}
                    {State.preferences.deleteEdgePanelOpen &&
                        State.interaction.selectedNode && (
                            <DeleteEdgeInteractionPanel
                                onNode={State.interaction.selectedNode}
                            />
                        )}
                    <InteractionModePanel />
                </div>
            );
        }
    }
);
