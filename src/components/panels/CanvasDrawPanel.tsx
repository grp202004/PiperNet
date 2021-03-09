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
                        brushRadius={5}
                        brushColor={"#F6B26B"}
                        catenaryColor={"#F6B26B"}
                    />
                </div>
            );
        }

        exportDrawing() {
            let hightDiff = 50;
            const data = JSON.parse(this.canvasMethods.getSaveData());
            let res = data.lines[0].points as { x: number; y: number }[];
            res.map((value) => {
                value.y += hightDiff;
            });
            res = [res[0], res[res.length - 1]];
            res.unshift({ x: 0, y: 0 });
            res.push({ x: this.canvas.width, y: 0 });
            res.push({ x: 0, y: 0 });
            console.log(res);
            State.clusterInteraction.lineSegment = res;
            console.log(State.clusterInteraction.computeSplitCluster());
        }
    }
);
