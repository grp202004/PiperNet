import React from "react";
import { observer } from "mobx-react";
import CanvasDraw from "react-canvas-draw";
import ReactDOM from "react-dom";
import ComponentRef from "../ComponentRef";
import State from "../../state";

export default observer(
    class CanvasDrawPanel extends React.Component {
        //@ts-ignore
        canvasRef: React.MutableRefObject<CanvasDraw> = React.createRef();

        get canvasMethods() {
            return this.canvasRef.current;
        }

        get canvas() {
            let element = ReactDOM.findDOMNode(ComponentRef.visualizer);
            return (element as Element)?.getBoundingClientRect();
        }

        render() {
            return (
                <div
                    onMouseUp={() => {
                        this.exportDrawing();
                    }}
                >
                    <CanvasDraw
                        ref={this.canvasRef}
                        style={{
                            position: "absolute",
                            top: this.canvas.y,
                        }}
                        canvasHeight={this.canvas.height}
                        canvasWidth={this.canvas.width}
                        lazyRadius={0}
                        brushRadius={3}
                        brushColor={"#F6B26B"}
                        catenaryColor={"#F6B26B"}
                    />
                </div>
            );
        }

        exportDrawing() {
            State.helper.clusterSplittingCurrentStep = 3;
            let hightDiff = 50;
            const data = JSON.parse(this.canvasMethods.getSaveData());
            let drawPoints = data?.lines[0]?.points as {
                x: number;
                y: number;
            }[];
            if (!drawPoints) {
                return;
            }
            drawPoints.map((value) => {
                value.y += hightDiff;
            });

            // line was drawn left to right
            if (drawPoints[0].x < drawPoints[drawPoints.length - 1].x) {
                drawPoints.unshift({ x: 0, y: 0 });
                drawPoints.push({ x: this.canvas.width, y: 0 });
                drawPoints.push({ x: 0, y: 0 });
            } else {
                drawPoints.reverse();
                drawPoints.unshift({ x: 0, y: 0 });
                drawPoints.push({ x: this.canvas.width, y: 0 });
                drawPoints.push({ x: 0, y: 0 });
            }

            // const firstPoint = drawPoints[0];
            // const x1 = firstPoint.x,
            //     y1 = firstPoint.y;
            // const lastPoint = drawPoints[drawPoints.length - 1];
            // const x2 = lastPoint.x,
            //     y2 = lastPoint.y;
            // const slope = (y1 - y2) / (x1 - x2);
            // const b = (x1 * y2 - x2 * y1) / (x1 - x2);

            // const leftIntersect = { x: 0, y: b };
            // const rightIntersect = {
            //     x: this.canvas.width,
            //     y: slope * this.canvas.width + b,
            // };
            // const topIntersect = { x: -b / slope, y: 0 };
            // const bottomIntersect = {
            //     x: (this.canvas.height - b) / slope,
            //     y: this.canvas.height,
            // };

            State.clusterInteraction.lineSegment = drawPoints;
            State.clusterInteraction.computeSplitCluster();
        }

        clearDrawing() {
            this.canvasMethods.clear();
        }

        componentDidMount = () => {
            ComponentRef.canvasDrawPanel = this;
            this.clearDrawing();
        };
    }
);
