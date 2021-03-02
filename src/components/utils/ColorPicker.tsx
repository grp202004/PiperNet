import React from "react";
import {
    Button,
    Popover,
    PopoverInteractionKind,
    Position,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import { ColorResult, SketchPicker } from "react-color";

/**
 *
 * @interface Props
 */
interface Props {
    /**
     * the color to be previewed on the button
     *
     * @type {string}
     * @memberof Props
     */
    color: string;

    /**
     * function to call when a candidate is selected, will be called on every selection of candidate
     *
     * @memberof Props
     */
    onChange: (color: ColorResult) => void;
}

/**
 * this component can be used to choose the node among all the nodes, with basic search filters available
 * to use it, you have to specify the text shown above the selectButton as well as the onChange function to call when a candidate is selected
 */
export default observer(
    class ColorPicker extends React.Component<Props, {}> {
        render() {
            return (
                <Popover
                    interactionKind={PopoverInteractionKind.CLICK}
                    popoverClassName="bp3-popover-content-sizing"
                    position={Position.RIGHT}
                >
                    <Button
                        text="  "
                        style={{
                            backgroundColor: this.props.color,
                        }}
                        small={true}
                    />
                    <div>
                        <SketchPicker
                            color={this.props.color}
                            onChange={(it) => {
                                this.props.onChange(it);
                            }}
                        />
                    </div>
                </Popover>
            );
        }
    }
);
