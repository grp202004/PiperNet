import React from "react";
import { Classes, Tab, Tabs, Button } from "@blueprintjs/core";
import classnames from "classnames";
import { observer } from "mobx-react";
import State from "../state";
import SimpleSelect from "./utils/SimpleSelect";
// import { addNode } from "../ipc/client";
import NodesPanel from "./panels/NodesPanel";
import EdgesPanel from "./panels/EdgesPanel";
import LabelsPanel from "./panels/LabelsPanel";
import NodeDetail from "./panels/NodeDetailPanel";
import MultiDetailPanel from "./panels/Multi-detailPanel";
// import Legends from "./Legends";
// // import StatusBar from './StatusBar';
// import SelectionActionPanel from "./panels/SelectionActionPanel";

// TODO: migrate to simple select

let RenderOptionsCard = observer(
    class RenderOptionsCard extends React.Component {
        render() {
            return (
                <div>
                    <h2>Graph Options</h2>
                    <Tabs animate={true}>
                        <Tab id="nodes" title="Nodes" panel={<NodesPanel />} />
                        <Tab id="edges" title="Edges" panel={<EdgesPanel />} />
                        <Tab
                            id="labels"
                            title="Labels"
                            panel={<LabelsPanel />}
                        />
                        {/* <Tab2 id="layout" title="Layout" panel={<LayoutPanel />} /> */}
                        <Tabs.Expander />
                    </Tabs>
                </div>
            );
        }
    }
);
//

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
            State.preferences.isRenderOptionsCardHidden = !State.preferences
                .isRenderOptionsCardHidden;
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
                                "left-overlay-card",
                                "transparent-frame",
                                "left-cards"
                            )}
                            style={
                                State.preferences.isRenderOptionsCardHidden
                                    ? this.optionsInvisible
                                    : this.optionsVisible
                            }
                        >
                            <br />
                            <Button
                                className="openbtn2"
                                icon="chevron-left"
                                onClick={this.toggleOptions}
                            ></Button>
                            <br />
                            <RenderOptionsCard />
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
                                    State.preferences.isRenderOptionsCardHidden
                                        ? this.sideButtonVis
                                        : this.sideButtonInv
                                }
                            ></Button>
                        </div>
                    </div>

                    {/* single selected */}
                    {/* {State.graph.selectedNodes.length === 1 && (
                        <NodeDetail node={State.graph.currentlyHoveredId} />
                    )} */}
                    {State.graph.currentlyHoveredId != "undefined" && (
                        <NodeDetail />
                    )}

                    {/* multiple selected */}
                    {/* {State.graph.selectedNodes.length !== 1 && State.graph.currentlyHovered && (
                        <NodeDetail node={State.graph.currentlyHovered.data.ref} />
                    )} */}
                    <MultiDetailPanel />

                    {/* <Legends />
          <StatusBar /> */}
                    {/* {// This menu only shows when there are nodes selected
            State.graph.selectedNodes.length > 0 && !State.preferences.isNavbarInMinimalMode && <SelectionActionPanel />
          } */}
                </div>
            );
        }
    }
);

// export default FloatingCards;
