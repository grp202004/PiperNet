import React from "react";
import { Card, Slider, Switch } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../state";
import ColorPicker from "../utils/ColorPicker";

export default observer(
    /**
     * @description This component will be used to change style of label
     * @author Zhiyuan Lyu, Zichen Xu
     * @extends {React.Component}
     */
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
                    <Card className={"sub-option"}>
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
                    </Card>
                </div>
            );
        }
    }
);
