import React from "react";
import { Classes, Slider, Switch } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../state";
import classnames from "classnames";
import ColorPicker from "../utils/ColorPicker";

export default observer(
    class LabelsPanel extends React.Component {
        render() {
            return (
                <div>
                    <Switch
                        label="Show Node Label"
                        checked={State.css.label.show}
                        onChange={() => {
                            State.css.label.show = !State.css.label.show;
                            State.graphDelegate.graphDelegateMethods.refresh();
                        }}
                    />
                    <br />
                    <div className={classnames(Classes.CARD, "sub-option")}>
                        Label Size:
                        <br />
                        <Slider
                            min={1}
                            max={10}
                            stepSize={1}
                            labelStepSize={2}
                            onChange={(value) => {
                                State.css.label.size = value;
                                State.graphDelegate.graphDelegateMethods.refresh();
                            }}
                            value={State.css.label.size}
                        />
                        <br />
                        <p style={{ textAlign: "left" }}>
                            Label Color:
                            <span style={{ float: "right" }}>
                                <ColorPicker
                                    color={State.css.label.color}
                                    onChange={(it) => {
                                        State.css.label.color = it.hex;
                                        State.graphDelegate.graphDelegateMethods.refresh();
                                    }}
                                />
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
    }
);
