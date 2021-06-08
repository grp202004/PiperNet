import React from "react";
import { observer } from "mobx-react";
import State from "../../../state";
import { NAVBAR_HEIGHT } from "../../../constants";
import { ICanvasDrawProps } from "./CanvasDrawPanel";

export default observer(
    /**
     * @description canvas to draw circle gesture when cluster splitting
     * @author Zichen XU
     * @class CanvasDrawFreeCirclePanel
     */
    class CanvasDrawFreeCirclePanel extends React.Component<
        ICanvasDrawProps,
        {}
    > {
        private centerPoint = { x: 0, y: 0 } as { x: number; y: number };
        private radius = 0 as number;
        private mouseDown = false;

        onMouseDownCallback = (
            event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
        ) => {
            this.centerPoint = {
                x: event.clientX,
                y: event.clientY - NAVBAR_HEIGHT,
            };
            this.mouseDown = true;
        };

        onMouseMoveCallback = (
            event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
        ) => {
            if (this.mouseDown) {
                this.radius = Math.sqrt(
                    Math.pow(event.clientX - this.centerPoint.x, 2) +
                        Math.pow(
                            event.clientY - NAVBAR_HEIGHT - this.centerPoint.y,
                            2
                        )
                );
                this.drawPoints();
            }
        };

        onMouseUpCallback = (
            event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
        ) => {
            if (this.mouseDown) {
                this.mouseDown = false;
                this.exportDrawing();
            }
        };

        exportDrawing() {
            State.helper.clusterSplittingCurrentStep = 3;

            // State.clusterInteraction.lineSegment = drawPoints;
            State.clusterInteraction.computeSplitClusterInCircle(
                this.centerPoint.x,
                this.centerPoint.y,
                this.radius
            );
        }

        ctx!: CanvasRenderingContext2D;

        drawPoints() {
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "round";
            this.ctx.clearRect(
                0,
                0,
                this.ctx.canvas.width,
                this.ctx.canvas.height
            );
            this.ctx.lineWidth = 5;

            this.ctx.beginPath();

            this.ctx.arc(
                this.centerPoint.x,
                this.centerPoint.y,
                this.radius,
                0,
                2 * Math.PI
            );

            this.ctx.strokeStyle = "#F6B26B";
            this.ctx.stroke();
        }

        clearDrawing() {
            this.ctx?.clearRect(
                0,
                0,
                this.ctx.canvas.width,
                this.ctx.canvas.height
            );
        }

        render() {
            return (
                <canvas
                    style={{
                        position: "absolute",
                        zIndex: 20,
                    }}
                    width={this.props.boundingRect.width}
                    height={this.props.boundingRect.height}
                    ref={(canvas) => {
                        if (canvas) {
                            this.ctx = canvas.getContext(
                                "2d"
                            ) as CanvasRenderingContext2D;
                        }
                    }}
                    onMouseDown={this.onMouseDownCallback}
                    onMouseMove={this.onMouseMoveCallback}
                    onMouseUp={this.onMouseUpCallback}
                />
            );
        }

        componentDidMount = () => {
            this.clearDrawing();
        };

        componentWillUnmount = () => {
            this.clearDrawing();
        };
    }
);
