import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { Classes } from "@blueprintjs/core";
import classnames from "classnames";
import Collapsable from "../utils/Collapsable";
import ColorPicker from "../utils/ColorPicker";

export default observer(
    class EdgesPanel extends React.Component {
        state = {
            sizeOptionOpen: false,
            thicknessOptionOpen: false,
            colorOptionOpen: false,
            forceOptionOpen: false,
        };

        render() {
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
                                    Default Color:
                                    <span style={{ float: "right" }}>
                                        <ColorPicker
                                            color={State.css.edge.defaultColor}
                                            onChange={(it) => {
                                                State.css.edge.defaultColor =
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
                                            color={State.css.edge.selectedColor}
                                            onChange={(it) => {
                                                State.css.edge.selectedColor =
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
                                            color={
                                                State.css.edge.highlightColor
                                            }
                                            onChange={(it) => {
                                                State.css.edge.highlightColor =
                                                    it.hex;
                                            }}
                                        />
                                    </span>
                                </p>
                            </section>
                        </div>
                    </Collapsable>
                </div>
            );
        }
    }
);
