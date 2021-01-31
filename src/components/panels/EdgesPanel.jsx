import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import {
    Button,
    Classes,
    Popover,
    PopoverInteractionKind,
    Position,
} from "@blueprintjs/core";
import { SketchPicker } from "react-color";
// import { Popover2, Select } from "@blueprintjs/labs";
import classnames from "classnames";
import Collapsable from "../utils/Collapsable";
import * as THREE from "three";
// import SimpleSelect from "../utils/SimpleSelect";
// import mouse from "../../graph-frontend/src/select";

export default observer(
    class EdgesPanel extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                timeOutRef: null,
                sizeOptionOpen: false,
                thicknessOptionOpen: false,
                colorOptionOpen: false,
            };
        }

        render() {
            let graph = State.graph.graph;
            return (
                <div>
                    <p>{`Modifying All Edges`}</p>

                    {/* Collapsable Option: Color */}
                    <Collapsable
                        name="Color"
                        isOpen={this.state.colorOptionOpen}
                        onToggle={() =>
                            this.setState({
                                colorOptionOpen: !this.state.colorOptionOpen,
                            })
                        }
                    >
                        <div className={classnames(Classes.CARD, "sub-option")}>
                            <section>
                                <p style={{ textAlign: "left" }}>
                                    Select Edge Color:
                                    <span style={{ float: "right" }}>
                                        <Popover
                                            interactionKind={
                                                PopoverInteractionKind.CLICK
                                            }
                                            popoverClassName="bp3-popover-content-sizing"
                                            position={Position.RIGHT}
                                        >
                                            <Button
                                                text="  "
                                                style={{
                                                    backgroundImage: "inherit",
                                                    backgroundColor:
                                                        State.css.config.edges
                                                            .color,
                                                }}
                                            />
                                            <div>
                                                <SketchPicker
                                                    color={
                                                        State.css.config.edges
                                                            .color
                                                    }
                                                    onChange={(it) => {
                                                        // State.graph.process.graph.forEachNode(n => {

                                                        //     let red = new THREE.Color(State.graph.edges.color).r;
                                                        //     let blue = new THREE.Color(State.graph.edges.color).g;
                                                        //     let green = new THREE.Color(State.graph.edges.color).b;
                                                        //     n.renderData.linecolor.r = red;
                                                        //     n.renderData.linecolor.g = blue;
                                                        //     n.renderData.linecolor.b = green;
                                                        // });

                                                        State.css.config.edges.color =
                                                            it.hex;
                                                        console.log(it.hex);
                                                        /**update edge color in real time*/
                                                        // State.graph.process.onHover();
                                                    }}
                                                />
                                            </div>
                                        </Popover>
                                    </span>
                                </p>
                            </section>
                        </div>
                    </Collapsable>

                    {/* Collapsable Option: Thickness */}
                    {/* <Collapsable
                    name="Thickness"
                    isOpen={this.state.thicknessOptionOpen}
                    onToggle={() =>
                        this.setState({
                            thicknessOptionOpen: !this.state.thicknessOptionOpen
                        })
                    }
                    >
                    <div className={classnames(Classes.CARD, "sub-option")}>
                        <section>
                            <p>Select Edge Thickness: </p>
                            <div style={{display: "inline", float: "right"}}>

                            </div>
                        </section>
                    </div>
                </Collapsable> */}
                </div>
            );
        }
    }
);
// export default EdgesPanel;
