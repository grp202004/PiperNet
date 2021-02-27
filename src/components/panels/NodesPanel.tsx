import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { Classes, Slider } from "@blueprintjs/core";
import classnames from "classnames";
import Collapsable from "../utils/Collapsable";
import ColorPicker from "../utils/ColorPicker";

export default observer(
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
                    <div className={classnames(Classes.CARD, "sub-option")}>
                        <section>
                            <p style={{ textAlign: "left" }}>
                                Default Color:
                                <span style={{ float: "right" }}>
                                    <ColorPicker
                                        color={State.css.node.defaultColor}
                                        onChange={(it) => {
                                            State.css.node.defaultColor =
                                                it.hex;
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
                                        }}
                                    />
                                </span>
                            </p>
                        </section>
                    </div>
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
                    <div className={classnames(Classes.CARD, "sub-option")}>
                        Node Size:
                        <br />
                        <Slider
                            min={1}
                            max={20}
                            stepSize={1}
                            labelStepSize={5}
                            onChange={(value) => {
                                State.css.node.size = value;
                            }}
                            value={State.css.node.size}
                        />
                    </div>
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
                    <div className={classnames(Classes.CARD, "sub-option")}>
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
                    </div>
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
