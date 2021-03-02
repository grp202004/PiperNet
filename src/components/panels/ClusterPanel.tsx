import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { Classes, Slider } from "@blueprintjs/core";
import classnames from "classnames";
import Collapsable from "../utils/Collapsable";
import SimpleSelect from "../utils/SimpleSelect";

export default observer(
    class ClusterPanel extends React.Component {
        state = {
            shapeOptionOpen: false,
            forceOptionOpen: false,
        };

        forceCollapse = () => {
            return (
                <Collapsable
                    name="Force"
                    isOpen={this.state.forceOptionOpen}
                    onToggle={() =>
                        this.setState({
                            forceOptionOpen: !this.state.forceOptionOpen,
                        })
                    }
                >
                    <div className={classnames(Classes.CARD, "sub-option")}>
                        Cluster Force Distance:
                        <br />
                        <Slider
                            min={0}
                            max={100}
                            stepSize={10}
                            labelStepSize={20}
                            onChange={(value) => {
                                State.css.cluster.clusterForce = value;
                                State.graphDelegate.updateClusterForce();
                            }}
                            value={State.css.cluster.clusterForce}
                        />
                    </div>
                    <div className={classnames(Classes.CARD, "sub-option")}>
                        Normal Force Distance:
                        <br />
                        <Slider
                            min={0}
                            max={100}
                            stepSize={10}
                            labelStepSize={20}
                            onChange={(value) => {
                                State.css.cluster.normalForce = value;
                                State.graphDelegate.updateClusterForce();
                            }}
                            value={State.css.cluster.normalForce}
                        />
                    </div>
                </Collapsable>
            );
        };

        shapeCollapse = () => {
            return (
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
                        <p style={{ textAlign: "left" }}>
                            Cluster Shape:
                            <span style={{ float: "right" }}>
                                <SimpleSelect
                                    items={["convexHull", "sphere"]}
                                    text={State.css.cluster.shape}
                                    onSelect={(it) =>
                                        (State.css.cluster.shape = it)
                                    }
                                    small={true}
                                />
                            </span>
                        </p>
                    </div>
                    {State.css.cluster.shape === "sphere" && (
                        <div className={classnames(Classes.CARD, "sub-option")}>
                            Cluster Resolution:
                            <br />
                            <Slider
                                min={2}
                                max={20}
                                stepSize={1}
                                labelStepSize={5}
                                onChange={(value) => {
                                    State.css.cluster.resolution = value;
                                }}
                                value={State.css.cluster.resolution}
                            />
                        </div>
                    )}
                </Collapsable>
            );
        };

        render() {
            return (
                <div>
                    <div>
                        <p>Modifying All Clusters</p>
                    </div>
                    {this.forceCollapse()}
                    {this.shapeCollapse()}
                </div>
            );
        }
    }
);
// export default EdgesPanel;
