import React from "react";
import { Button, Classes, Slider, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { SketchPicker } from "react-color";
import { Select } from "@blueprintjs/select";
import classnames from "classnames";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import State from "../../state";
import SwitchCollapsable from "../utils/SwitchCollapsable";
import CommonItemRenderer from "../utils/CommonItemRenderer";

export default observer(
  class SelectionPanel extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        shapeOptionOpen: false,
        sizeOptionOpen: false,
        colorOptionOpen: false,
        labelOptionOpen: false
      };
    }

    // twoLayerUpdate = (nodeId, key, value) => {
    //   if (!State.graph.overrides.has(nodeId)) {
    //     State.graph.overrides.set(nodeId, new Map());
    //   }
    //   const nodeAttrs = State.graph.overrides.get(nodeId);
    //   if (value !== null) {
    //     nodeAttrs.set(key, value);
    //   } else {
    //     nodeAttrs.delete(key);
    //     if (nodeAttrs.size === 0) {
    //       State.graph.overrides.delete(nodeId);
    //     }
    //   }
    // };

    // batchTwoLayerUpdate = (nodes, key, value) => {
    //   runInAction("update entire selection", () => {
    //     nodes.forEach(n => this.twoLayerUpdate(n.data.ref.id, key, value));
    //   });
    // };

    render() {
      return (
        <div>
          <br />
          <SwitchCollapsable
            name="Override Size"
            isOpen={this.state.sizeOptionOpen}
            onToggle={() => {
              if (this.state.sizeOptionOpen) {
                this.setState(
                  {
                    sizeOptionOpen: false
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "size",
                  //     null
                  //   )
                );
              } else {
                this.setState(
                  {
                    sizeOptionOpen: true
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "size",
                  //     State.graph.overrideConfig.size
                  //   )
                );
              }
            }}
          >
            <div className={classnames(Classes.CARD, "sub-option")}>
              <Slider
                min={1}
                max={20}
                stepSize={0.1}
                labelStepSize={5}
                // onChange={it => {
                //   State.graph.overrideConfig.size = it;
                //   this.batchTwoLayerUpdate(
                //     State.graph.selectedNodes,
                //     "size",
                //     it
                //   );
                // }}
                // value={State.graph.overrideConfig.size}
                value={2}//set for test
              />
            </div>
          </SwitchCollapsable>
          <br />
          <SwitchCollapsable
            name="Override Color"
            isOpen={this.state.colorOptionOpen}
            onToggle={() => {
              if (this.state.colorOptionOpen) {
                this.setState(
                  {
                    colorOptionOpen: false
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "color",
                  //     null
                  //   )
                );
              } else {
                this.setState(
                  {
                    colorOptionOpen: true
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "color",
                  //     State.graph.overrideConfig.color
                  //   )
                );
              }
            }}
          >
            <div className={classnames(Classes.CARD, "sub-option")}>
              <section> <p style={{ textAlign: "left" }}>
                Choose Color:
            <span style={{ float: "right" }}>
                  <Popover
                    //previous!!
                    // placement="bottom"
                    // modifiers={{
                    //   preventOverflow: {
                    //     enabled: false,
                    //   },
                    // }}
                    interactionKind={PopoverInteractionKind.CLICK}
                    popoverClassName="bp3-popover-content-sizing"
                    position={Position.RIGHT}

                  >
                    <Button
                      text="  "
                      style={{
                        backgroundImage: "inherit",
                        // backgroundColor: State.graph.overrideConfig.color
                      }}
                    />
                    <SketchPicker
                    // color={State.graph.overrideConfig.color}
                    // onChange={it => {
                    //   State.graph.overrideConfig.color = it.hex;
                    //   this.batchTwoLayerUpdate(
                    //     State.graph.selectedNodes,
                    //     "color",
                    //     it.hex
                    //   );
                    // }}
                    />
                  </Popover>
                </span>
              </p>
              </section>
            </div>
          </SwitchCollapsable>
          <br />
          <SwitchCollapsable
            name="Override Label"
            isOpen={this.state.labelOptionOpen}
            onToggle={() => {
              if (this.state.labelOptionOpen) {
                this.setState(
                  {
                    labelOptionOpen: false
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "label",
                  //     null
                  //   )
                );
              } else {
                this.setState(
                  {
                    labelOptionOpen: true
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "label",
                  //     State.graph.overrideConfig.label
                  //   )
                );
              }
            }}
          >
            <div className={classnames(Classes.CARD, "sub-option")}>
              Custom Label:
            <input
                value={"test"}//used for test
              // value={State.graph.overrideConfig.label}
              // onChange={it => {
              //   State.graph.overrideConfig.label = it.target.value;
              //   this.batchTwoLayerUpdate(
              //     State.graph.selectedNodes,
              //     "label",
              //     it.target.value
              //   );
              // }}
              />
            </div>
          </SwitchCollapsable>
          <br />
          <SwitchCollapsable
            name="Override Shape"
            isOpen={this.state.shapeOptionOpen}
            onToggle={() => {
              if (this.state.shapeOptionOpen) {
                this.setState(
                  {
                    shapeOptionOpen: false
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "shape",
                  //     null
                  //   )
                );
              } else {
                this.setState(
                  {
                    shapeOptionOpen: true
                  }
                  // ,
                  // () =>
                  //   this.batchTwoLayerUpdate(
                  //     State.graph.selectedNodes,
                  //     "shape",
                  //     State.graph.overrideConfig.shape
                  //   )
                );
              }
            }}
          >
            <div className={classnames(Classes.CARD, "sub-option")}>
              <section> <p style={{ textAlign: "left" }}>
                Node Shape:
            <span style={{ float: "right" }}>
                  <Select
                    items={[
                      "shape1",
                      "shape2",
                      "shape3",
                      "shape4",
                      "shape5"
                    ]}
                    itemRenderer={CommonItemRenderer}
                    filterable={false}
                    onItemSelect={it => {
                      console.log(it)//used for test
                      // State.graph.overrideConfig.shape = it;
                      // this.batchTwoLayerUpdate(
                      //   State.graph.selectedNodes,
                      //   "shape",
                      //   it
                      // );
                    }
                    }
                  >
                    {/* <Button text={State.graph.overrideConfig.shape} /> */}
                    <Button text={"change"} />
                    {/* upper is used for test */}
                  </Select>
                </span>
              </p>
              </section>
            </div>
          </SwitchCollapsable>
        </div>
      );
    }
  }
);
// export default SelectionPanel;