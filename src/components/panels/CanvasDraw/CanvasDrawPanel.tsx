import React from "react";
import { observer } from "mobx-react";
import ReactDOM from "react-dom";
import ComponentRef from "../../ComponentRef";
import { DrawMode } from "../../../state/ClusterInteractionStore";
import CanvasDrawFreehandPanel from "./CanvasDrawFreehandPanel";
import CanvasDrawStraightLinePanel from "./CanvasDrawStraightLinePanel";
import CanvasDrawFreeCirclePanel from "./CanvasDrawFreeCirclePanel";
import CanvasDrawCenterCirclePanel from "./CanvasDrawCenterCirclePanel";
import State from "../../../state";

export interface ICanvasDrawProps {
    boundingRect: DOMRect;
}

export default observer(
    /**
     * @description another canvas to draw free-hand gesture when cluster splitting
     * @author Zichen XU
     * @class CanvasDrawPanel
     * @extends {React.Component}
     */
    class CanvasDrawPanel extends React.Component {
        get canvas() {
            let element = ReactDOM.findDOMNode(ComponentRef.visualizer);
            return (element as Element)?.getBoundingClientRect();
        }

        render() {
            switch (State.clusterInteraction.drawMode) {
                case DrawMode.StraightLine:
                    return (
                        <CanvasDrawStraightLinePanel
                            boundingRect={this.canvas}
                        />
                    );

                case DrawMode.FreeLine:
                    return (
                        <CanvasDrawFreehandPanel boundingRect={this.canvas} />
                    );

                case DrawMode.FreeCircle:
                    return (
                        <CanvasDrawFreeCirclePanel boundingRect={this.canvas} />
                    );

                case DrawMode.CenterCircle:
                    return (
                        <CanvasDrawCenterCirclePanel
                            boundingRect={this.canvas}
                        />
                    );
            }
        }
    }
);
