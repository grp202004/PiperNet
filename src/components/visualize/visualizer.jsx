import { observe } from "mobx";
import React from "react";
import { observer } from "mobx-react";
import {
    ForceGraph2D,
    ForceGraph3D,
    ForceGraphVR,
    ForceGraphAR,
} from "react-force-graph";

export default observer(
    class ThreeJSVis extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                data: {
                    nodes: [
                        {
                            id: "id1",
                            name: "name1",
                            val: 1,
                        },
                        {
                            id: "id2",
                            name: "name2",
                            val: 10,
                        },
                    ],
                    links: [
                        {
                            source: "id1",
                            target: "id2",
                        },
                    ],
                },
            };
        }

        render() {
            return <ForceGraph3D graphData={this.state.data} />;
        }
    }
);
