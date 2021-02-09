import React from "react";
import { Button, Classes, Slider } from "@blueprintjs/core";
import { observer } from "mobx-react";

export default observer(
    class LabelsPanel extends React.Component {
        render() {
            return (
                <div>
                    <span style={{ display: "inline-block" }}>
                        <Button
                            style={{ width: "100px" }}
                            id="hideAll"
                            icon="eye-off"
                            className={Classes.FILL}
                            // onClick={() => State.graph.frame.hideAllLabels()}
                        >
                            Hide All
                        </Button>
                        <Button
                            style={{ width: "100px", display: "none" }}
                            id="showAll"
                            icon="eye-on"
                            className={Classes.FILL}
                            // onClick={() => State.graph.frame.showAllLabels()}
                        >
                            Show All
                        </Button>
                        <Button
                            style={{ width: "140px", marginLeft: "10px" }}
                            id="hideSelected"
                            icon="eye-off"
                            className={Classes.FILL}
                            // onClick={() =>
                            //     State.graph.frame.hideSelectedLabels()
                            // }
                        >
                            Hide Selected
                        </Button>
                        <Button
                            style={{
                                width: "140px",
                                marginLeft: "10px",
                                display: "none",
                            }}
                            id="showSelected"
                            icon="eye-on"
                            className={Classes.FILL}
                            // onClick={() =>
                            //     State.graph.frame.showSelectedLabels()
                            // }
                        >
                            Show Selected
                        </Button>
                    </span>
                    <div style={{ height: "20px" }} />
                    <h6>Label Size</h6>
                    <Slider
                        min={0.5}
                        max={3}
                        stepSize={0.1}
                        // onChange={value => {
                        //   State.graph.nodes.labelSize = value;
                        // }}
                        // value={State.graph.nodes.labelSize}
                        initialValue={2}
                        value={2}
                    />
                    <div style={{ height: "20px" }} />
                    <h6>Label Length</h6>
                    <Slider
                        min={1}
                        max={32}
                        stepSize={0.1}
                        labelStepSize={5}
                        // onChange={value => {
                        //   State.graph.nodes.labelLength = value;
                        // }}
                        // value={State.graph.nodes.labelLength}
                        value={10}
                    />
                    <div style={{ height: "20px" }} />
                    <h6>Label By</h6>
                    {/* <Select
            items={State.graph.allPropertiesKeyList}
            itemRenderer={CommonItemRenderer}
            filterable={false}
            onItemSelect={it => (State.graph.nodes.labelBy = it)}
          >
            <Button text={State.graph.nodes.labelBy} />
          </Select> */}
                </div>
            );
        }
    }
);
