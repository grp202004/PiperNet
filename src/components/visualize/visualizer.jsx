import React from "react";
import { observer } from "mobx-react";
import {
    ForceGraph2D,
    ForceGraph3D,
    ForceGraphVR,
    ForceGraphAR,
} from "react-force-graph";
import SimpleSelect from "../utils/SimpleSelect";
import State from "../../state/index";

export default observer(
    class ThreeJSVis extends React.Component {
        state = {
            viewOptions: ["3D", "2D"],
            view: "3D",
        };

        renderGraph = () => {
            if (this.state.view === "3D") {
                return (
                    <ForceGraph3D
                        graphData={State.graph.adapterGraph}
                        nodeResolution={20}
                    />
                );
            } else {
                return (
                    <ForceGraph2D
                        graphData={State.graph.adapterGraph}
                        dagMode={"td"}
                        // dagLevelDistance={300}
                        // backgroundColor="#101020"
                        nodeRelSize={1}
                        // nodeId="path"
                        // nodeVal={(node) => 100 / (node.level + 1)}
                        // nodeLabel="path"
                        // nodeAutoColorBy="module"
                        // linkDirectionalParticles={2}
                        // linkDirectionalParticleWidth={2}
                        d3VelocityDecay={0.3}
                    />
                );
            }
        };

        render() {
            return (
                <div>
                    <SimpleSelect
                        class="overlay-button"
                        items={this.state.viewOptions}
                        value={this.state.view}
                        onSelect={(it) => this.setState({ view: it })}
                    />
                    {this.renderGraph()}
                </div>
            );
        }
    }
);
