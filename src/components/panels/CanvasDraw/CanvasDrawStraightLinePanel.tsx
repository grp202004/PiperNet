import { observer } from "mobx-react";
import React from "react";
import State from "../../../state";
import { ICanvasDrawProps } from "./CanvasDrawPanel";

export default observer(
    /**
     * @description the canvas to draw a straight line when splitting the cluster
     * @author Zichen XU
     * @class CanvasDrawStraightLinePanel
     * @extends {React.Component}
     */

    class CanvasDrawStraightLinePanel extends React.Component<ICanvasDrawProps> {
        private startPoint = { x: 0, y: 0 };
        private endPoint = { x: 100, y: 100 };
        private mouseDown = false;

        onMouseDownCallback = (
            event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
        ) => {
            this.startPoint = { x: event.clientX, y: event.clientY - 50 };
            this.endPoint = { x: event.clientX, y: event.clientY - 50 };
            this.mouseDown = true;
        };

        onMouseMoveCallback = (
            event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
        ) => {
            if (this.mouseDown) {
                this.endPoint = { x: event.clientX, y: event.clientY - 50 };
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
            let drawPoints = [
                { x: this.startPoint.x, y: this.startPoint.y },
                { x: this.endPoint.x, y: this.endPoint.y },
            ] as {
                x: number;
                y: number;
            }[];

            // line was drawn left to right
            if (drawPoints[0].x < drawPoints[1].x) {
                drawPoints.unshift({ x: 0, y: 0 });
                drawPoints.push({ x: this.props.boundingRect.width, y: 0 });
                drawPoints.push({ x: 0, y: 0 });
            } else {
                drawPoints.reverse();
                drawPoints.unshift({ x: 0, y: 0 });
                drawPoints.push({ x: this.props.boundingRect.width, y: 0 });
                drawPoints.push({ x: 0, y: 0 });
            }

            State.clusterInteraction.lineSegment = drawPoints;
            State.clusterInteraction.computeSplitCluster();
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

            this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
            this.ctx.lineTo(this.endPoint.x, this.endPoint.y);

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
