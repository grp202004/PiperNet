import React from "react";
import { Classes, Tab, Tabs } from "@blueprintjs/core";
import classnames from "classnames";
import { observer } from "mobx-react";
import appState from "../state";
import SimpleSelect from "./utils/SimpleSelect";
// import { addNode } from "../ipc/client";
// import NodesPanel from "./panels/NodesPanel";
// import EdgesPanel from "./panels/EdgesPanel";
// import LabelsPanel from "./panels/LabelsPanel";
import NodeDetail from "./panels/NodeDetailPanel";
import Legends from "./Legends";
// import StatusBar from './StatusBar';
// import SelectionActionPanel from "./panels/SelectionActionPanel";

// TODO: migrate to simple select

export default observer(
    class RenderOptionsCard extends React.Component {
        render() {
            return (
                <div>
                    <h4>Graph Options</h4>
                    <Tabs animate id="graph-options">
                        {/* <Tab id="nodes" title="Nodes" panel={<NodesPanel />} /> */}
                        {/* <Tab id="edges" title="Edges" panel={<EdgesPanel />} /> */}
                        {/* <Tab id="labels" title="Labels" panel={<LabelsPanel />} /> */}
                        {/* <Tab2 id="layout" title="Layout" panel={<LayoutPanel />} /> */}
                        <Tabs.Expander />
                    </Tabs>
                </div>
            );
        }
    }
);