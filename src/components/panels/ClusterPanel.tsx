import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { Card, Slider } from "@blueprintjs/core";
import Collapsable from "../utils/Collapsable";
import SimpleSelect from "../utils/SimpleSelect";

export default observer(
    /**
     * @description the sub-tab to alter the graph options of cluster
     * @author Zichen XU, Zhiyuan LYU
     * @class ClusterPanel
     * @extends {React.Component}
     */
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
                    <Card className={"sub-option"}>
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
                    </Card>
                    <Card className={"sub-option"}>
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
                    </Card>
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
                    <Card className={"sub-option"}>
                        <p style={{ textAlign: "left" }}>
                            Cluster Shape:
                            <span style={{ float: "right" }}>
                                <SimpleSelect
                                    items={["convexHull", "sphere"]}
                                    text={State.css.cluster.shape}
                                    onSelect={(it) => {
                                        State.css.cluster.shape = it;
                                        State.graphDelegate.clusterObject.alterNodePosition();
                                    }}
                                    small={true}
                                />
                            </span>
                        </p>
                    </Card>
                    {State.css.cluster.shape === "sphere" && (
                        <Card className={"sub-option"}>
                            Cluster Resolution:
                            <br />
                            <Slider
                                min={2}
                                max={20}
                                stepSize={1}
                                labelStepSize={5}
                                onChange={(value) => {
                                    State.css.cluster.resolution = value;
                                    State.graphDelegate.graphDelegateMethods.refresh();
                                }}
                                value={State.css.cluster.resolution}
                            />
                        </Card>
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
