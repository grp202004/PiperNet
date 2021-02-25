import React from "react";
import {
    Button,
    Classes,
    Popover,
    PopoverInteractionKind,
    RangeSlider,
    Slider,
} from "@blueprintjs/core";
import { SketchPicker } from "react-color";
import { Select } from "@blueprintjs/select";
import classnames from "classnames";
import { observer } from "mobx-react";
import pluralize from "pluralize";
import Collapsable from "../utils/Collapsable";
import SimpleSelect, { CommonItemRenderer } from "../utils/SimpleSelect";
import State from "../../state";

export default observer(
    class GlobalPanel extends React.Component {
        state = {
            timeOutRef: null,
            sizeOptionOpen: false,
            colorOptionOpen: false,
            shapeOptionOpen: false,
        };

        render() {
            return (
                <div>
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
                            {/* color : color by */}
                            <section>
                                <p style={{ textAlign: "left" }}>
                                    Color By:
                                    <span style={{ float: "right" }}>
                                        <SimpleSelect
                                            items={
                                                ["item1", "item2"]
                                                // State.graph.allPropertiesKeyList
                                            }
                                            onSelect={
                                                (it) =>
                                                    console.log(
                                                        "color:color by"
                                                    )
                                                // State.graph.nodes.colorBy = it
                                            }
                                            text={
                                                "1" //for test
                                                // State.graph.nodes.colorBy
                                            }
                                        />
                                    </span>
                                </p>
                            </section>

                            {/* color:scale type  */}
                            <section>
                                <p style={{ textAlign: "left" }}>
                                    Scale Type:
                                    <span style={{ float: "right" }}>
                                        <SimpleSelect
                                            items={
                                                ["item1", "item2"]
                                                // Object.keys(scales)
                                            }
                                            onSelect={
                                                (it) =>
                                                    console.log(
                                                        "color:scale type"
                                                    )
                                                // State.graph.nodes.color.scale = it
                                            }
                                            text={
                                                "2"
                                                // State.graph.nodes.color.scale
                                            }
                                        />
                                    </span>
                                </p>
                            </section>

                            {/* the gradient section in color */}
                            <section>
                                <p style={{ textAlign: "left" }}>
                                    Gradient: &nbsp;
                                    <span style={{ float: "right" }}>
                                        {/* left colorpicker */}
                                        <Popover
                                            // placement="bottom"
                                            // modifiers={{
                                            //   preventOverflow: {
                                            //     enabled: false,
                                            //   },
                                            // }}
                                            interactionKind={
                                                PopoverInteractionKind.CLICK
                                            }
                                            popoverClassName="bp3-popover-content-sizing"
                                            position={"auto"}
                                        >
                                            <Button
                                                text="  "
                                                // style={{
                                                //   // backgroundImage: "inherit",
                                                //   // backgroundColor: State.graph.nodes.color.from
                                                // }}
                                            />
                                            <SketchPicker
                                                color={
                                                    "#ffffff" //used for test
                                                    // State.graph.nodes.color.from
                                                }
                                                onChange={() => {
                                                    console.log(
                                                        "gradient section first colorpicker onchange"
                                                    );
                                                    // it => (State.graph.nodes.color.from = it.hex)
                                                }}
                                            />
                                        </Popover>
                                        {/* arrow  */}
                                        &nbsp; &#8594; &nbsp;
                                        {/* right colorpicker */}
                                        <Popover
                                            //previous!!
                                            // placement="bottom"
                                            // modifiers={{
                                            //   preventOverflow: {
                                            //     enabled: false,
                                            //   },
                                            // }}
                                            interactionKind={
                                                PopoverInteractionKind.CLICK
                                            }
                                            popoverClassName="bp3-popover-content-sizing"
                                            position={"auto"}
                                        >
                                            <Button
                                                text="  "
                                                style={{
                                                    backgroundImage: "inherit",
                                                    // backgroundColor: State.graph.nodes.color.to
                                                }}
                                            />
                                            <SketchPicker
                                                color={
                                                    "#ffffff" //used for test
                                                    // State.graph.nodes.color.to
                                                }
                                                onChange={() => {
                                                    console.log(
                                                        "gradient section second colorpicker onchange"
                                                    );
                                                    // it => (State.graph.nodes.color.to = it.hex)
                                                }}
                                            />
                                        </Popover>
                                    </span>
                                </p>
                            </section>
                            {/* color : gradient preview */}
                            <section style={{ marginTop: "-1em" }}>
                                <svg
                                    width="100%"
                                    height="10"
                                    className="gradient-preview"
                                >
                                    <defs>
                                        <linearGradient
                                            x1="0%"
                                            y1="50%"
                                            x2="100%"
                                            y2="50%"
                                            id="theGradient"
                                        >
                                            <stop
                                                stopColor={
                                                    "#ffffff" //used for test
                                                    // State.graph.nodes.color.from
                                                }
                                                stopOpacity="1"
                                                offset="0%"
                                            />
                                            <stop
                                                stopColor={
                                                    "#ffffff" //used for test
                                                    // State.graph.nodes.color.to
                                                }
                                                stopOpacity="1"
                                                offset="100%"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <rect
                                        x="0"
                                        y="0"
                                        width="100%"
                                        height="50"
                                        fill="url(#theGradient)"
                                    />
                                </svg>
                            </section>
                        </div>
                    </Collapsable>

                    {/* Collapsable Option: Size */}
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
                            {/* size : scale by  */}
                            <section>
                                <p style={{ textAlign: "left" }}>
                                    Scale By:
                                    <span style={{ float: "right" }}>
                                        <Select
                                            items={["item1", "item2"]}
                                            itemRenderer={CommonItemRenderer}
                                            filterable={false}
                                            onItemSelect={(item) => {
                                                console.log(
                                                    "size : scale by , component :select"
                                                );
                                                // it => (State.graph.nodes.sizeBy = it)
                                            }}
                                        >
                                            <Button
                                                text={
                                                    "btn1"
                                                    // State.graph.nodes.sizeBy
                                                }
                                            />
                                        </Select>
                                    </span>
                                </p>
                            </section>
                            {/* size : scale type */}
                            <section>
                                <p style={{ textAlign: "left" }}>
                                    Scale Type:
                                    <span style={{ float: "right" }}>
                                        <Select
                                            items={
                                                ["item1", "item2"]
                                                //Object.keys(scales)
                                            }
                                            itemRenderer={CommonItemRenderer}
                                            filterable={false}
                                            onItemSelect={(item) => {
                                                console.log(
                                                    "size : scale type component: select"
                                                );
                                                // it => (State.graph.nodes.size.scale = it)
                                            }}
                                        >
                                            <Button
                                                text={
                                                    "btn2"
                                                    // State.graph.nodes.size.scale
                                                }
                                            />
                                        </Select>
                                    </span>
                                </p>
                            </section>
                            Size Range:
                            <br />
                            <RangeSlider
                                min={1}
                                max={20}
                                stepSize={0.1}
                                labelStepSize={5}
                                // onChange={([a, b]) => {
                                //   runInAction("update scale", () => {
                                //     State.graph.nodes.size.min = a;
                                //     State.graph.nodes.size.max = b;
                                //   });
                                // }}
                                // value={[
                                //   State.graph.nodes.size.min,
                                //   State.graph.nodes.size.max
                                // ]}
                            />
                        </div>
                    </Collapsable>

                    {/* Collapsable Option: Shape */}
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
                            {/* shape : node shape */}
                            <section>
                                {" "}
                                <p style={{ textAlign: "left" }}>
                                    Node Shape:
                                    <span style={{ float: "right" }}>
                                        <Select
                                            items={[
                                                "circle",
                                                "square",
                                                "triangle",
                                                "pentagon",
                                                "hexagon",
                                                "octagon",
                                            ]}
                                            itemRenderer={CommonItemRenderer}
                                            filterable={false}
                                            onItemSelect={(item) => {
                                                console.log(
                                                    " shape : node shape component: select"
                                                );
                                                // it => (State.graph.nodes.shape = it)
                                            }}
                                        >
                                            <Button
                                                text={
                                                    "btn3"
                                                    // State.graph.nodes.shape
                                                }
                                            />
                                        </Select>
                                    </span>
                                </p>
                                <p style={{ textAlign: "left" }}>
                                    Node Resolution :
                                    <Slider
                                        min={6}
                                        max={20}
                                        stepSize={2}
                                        onChange={(value) => {
                                            State.css.nodeResolution = value;
                                        }}
                                        value={State.css.nodeResolution}
                                        initialValue={12}
                                    />
                                </p>
                            </section>
                        </div>
                    </Collapsable>
                    <br />
                    <small>
                        {/* {pluralize("node", State.graph.overrides.size, true)}<span> </span> */}
                        {pluralize("node", 0, true)}
                        <span> </span>
                        have override styles. &nbsp;
                        <Button
                            className={"pt-small"}
                            text="Clear"
                            // onClick={() => (State.graph.overrides = new Map())}
                        />
                    </small>
                </div>
            );
        }
    }
);
// export default GlobalPanel;
