import React from "react";
import { observer } from "mobx-react";
import { Attributes } from "graphology-types";
import classnames from "classnames";
import State from "../../state/index";

export default observer(
    /**
     * @description This component will be used when multi-select in the mode 'node selection'.
     * @author Zhiyuan LYU
     * @extends {React.Component}
     */
    class SelectionBox extends React.Component {
        state = {
            boxStyle: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
            },
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            mouseDown: false,
        };

        onMouseDownCallback = (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
            let startpoint = { x: event.clientX, y: event.clientY };
            this.setState({
                startPoint: startpoint,
                endPoint: startpoint,
                mouseDown: true,
            });
        };

        onMouseMoveCallback = (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
            if (this.state.mouseDown) {
                let endPoint = { x: event.clientX, y: event.clientY };
                this.setState({
                    endPoint: endPoint,
                    boxStyle: this._calculateSelectionBox(
                        this.state.startPoint,
                        this.state.endPoint
                    ),
                });
            }
        };

        onMouseUpCallback = (
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
            State.interaction.boxSelection_endPoint = {
                x: this.state.endPoint.x,
                y: this.state.endPoint.y,
            };
            State.interaction.boxSelection_startPoint = {
                x: this.state.startPoint.x,
                y: this.state.startPoint.y,
            };

            this.setState({
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 0, y: 0 },
                boxStyle: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                },
                mouseDown: false,
            });
            State.interaction.boxSelectNode();
        };

        _calculateSelectionBox(
            startPoint: Attributes,
            endPoint: Attributes
        ): Attributes {
            let left = Math.min(startPoint.x, endPoint.x);
            let top = Math.min(startPoint.y, endPoint.y);
            let width = Math.abs(startPoint.x - endPoint.x);
            let height = Math.abs(startPoint.y - endPoint.y);
            return { left: left, top: top, width: width, height: height };
        }

        render() {
            return (
                <div
                    className={classnames("boxCanvas")}
                    onMouseDown={this.onMouseDownCallback}
                    onMouseMove={this.onMouseMoveCallback}
                    onMouseUp={this.onMouseUpCallback}
                >
                    <div
                        className={classnames("selectionBox")}
                        style={this.state.boxStyle}
                    ></div>
                </div>
            );
        }
    }
);
