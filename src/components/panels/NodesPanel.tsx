import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { Card, Slider } from "@blueprintjs/core";
import Collapsable from "../utils/Collapsable";
import ColorPicker from "../utils/ColorPicker";

export default observer(
    /**
     * @description This component will be used to change style of nodes. Including color, size,etc
     * @author Zhiyuan LYU, Zichen XU
     * @extends {React.Component}
     */
    class NodesPanel extends React.Component {
        state = {
            timeOutRef: null,
            colorOptionOpen: false,
            sizeOptionOpen: false,
            shapeOptionOpen: false,
        };

        colorCollapse = () => {
            return (
                <Collapsable
                    name="Color"
                    isOpen={this.state.colorOptionOpen}
                    onToggle={() =>
                        this.setState({
                            colorOptionOpen: !this.state.colorOptionOpen,
                        })
                    }
                >
                    <Card className={"sub-option"}>
                        <section>
                            <p style={{ textAlign: "left" }}>
                                Default Color:
                                <span style={{ float: "right" }}>
                                    <ColorPicker
                                        color={State.css.node.defaultColor}
                                        onChange={(it) => {
                                            State.css.node.defaultColor =
                                                it.hex;

                                            State.graphDelegate.graphDelegateMethods.refresh();
                                        }}
                                    />
                                </span>
                            </p>
                        </section>

                        <section>
                            <p style={{ textAlign: "left" }}>
                                Selected Color:
                                <span style={{ float: "right" }}>
                                    <ColorPicker
                                        color={State.css.node.selectedColor}
                                        onChange={(it) => {
                                            State.css.node.selectedColor =
                                                it.hex;

                                            State.graphDelegate.graphDelegateMethods.refresh();
                                        }}
                                    />
                                </span>
                            </p>
                        </section>

                        <section>
                            <p style={{ textAlign: "left" }}>
                                Highlight Color:
                                <span style={{ float: "right" }}>
                                    <ColorPicker
                                        color={State.css.node.highlightColor}
                                        onChange={(it) => {
                                            State.css.node.highlightColor =
                                                it.hex;

                                            State.graphDelegate.graphDelegateMethods.refresh();
                                        }}
                                    />
                                </span>
                            </p>
                        </section>
                    </Card>
                </Collapsable>
            );
        };

        sizeCollapse = () => {
            return (
                <Collapsable
                    name="Size"
                    isOpen={this.state.sizeOptionOpen}
                    onToggle={() =>
                        this.setState({
                            sizeOptionOpen: !this.state.sizeOptionOpen,
                        })
                    }
                >
                    <Card className={"sub-option"}>
                        Node Size:
                        <br />
                        <Slider
                            min={1}
                            max={20}
                            stepSize={1}
                            labelStepSize={5}
                            onChange={(value) => {
                                State.css.node.size = value;
                                State.graphDelegate.graphDelegateMethods.refresh();
                            }}
                            value={State.css.node.size}
                        />
                    </Card>
                </Collapsable>
            );
        };

        shapeCollapse = () => {
            return (
                <Collapsable
                    name="Shape"
                    isOpen={this.state.shapeOptionOpen}
                    onToggle={() =>
                        this.setState({
                            shapeOptionOpen: !this.state.shapeOptionOpen,
                        })
                    }
                >
                    <Card className={"sub-option"}>
                        Node Resolution:
                        <br />
                        <Slider
                            min={2}
                            max={20}
                            stepSize={1}
                            labelStepSize={5}
                            onChange={(value) => {
                                State.css.node.resolution = value;
                            }}
                            value={State.css.node.resolution}
                        />
                    </Card>
                </Collapsable>
            );
        };

        render() {
            return (
                <div>
                    <div>
                        <p>Modifying All Nodes</p>
                    </div>
                    {this.colorCollapse()}
                    {this.sizeCollapse()}
                    {this.shapeCollapse()}
                </div>
            );
        }
    }
);
