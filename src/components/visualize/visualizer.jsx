import React from "react";
import { observer } from "mobx-react";
import {
    ForceGraph2D,
    ForceGraph3D,
    ForceGraphVR,
    ForceGraphAR,
} from "react-force-graph";
import State from "../../state/index";

export default observer(
    class ThreeJSVis extends React.Component {
        render() {
            return (
                <ForceGraph3D
                    graphData={State.graph.adapterGraph}
                    backgroundColor="white"
                />
            );
        }
    }
);
