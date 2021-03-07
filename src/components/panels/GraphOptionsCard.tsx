import { H3, Tab, Tabs } from "@blueprintjs/core";
import { observer } from "mobx-react";
import React from "react";
import ClusterPanel from "./ClusterPanel";
import EdgesPanel from "./EdgesPanel";
import LabelsPanel from "./LabelsPanel";
import NodesPanel from "./NodesPanel";

export default observer(
    class RenderOptionsCard extends React.Component {
        render() {
            return (
                <div>
                    <H3>Graph Options</H3>
                    <Tabs animate={true}>
                        <Tab id="nodes" title="Nodes" panel={<NodesPanel />} />
                        <Tab id="edges" title="Edges" panel={<EdgesPanel />} />
                        <Tab
                            id="labels"
                            title="Labels"
                            panel={<LabelsPanel />}
                        />
                        <Tab
                            id="clusters"
                            title="Clusters"
                            panel={<ClusterPanel />}
                        />

                        <Tabs.Expander />
                    </Tabs>
                </div>
            );
        }
    }
);
