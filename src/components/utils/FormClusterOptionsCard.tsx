import React, { CSSProperties } from "react";
import {
    Button,
    Callout,
    Card,
    Colors,
    Elevation,
    H6,
    Icon,
    InputGroup,
    Intent,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../state";
import ClusterChooser, { ClusterAdder } from "./ClusterChooser";
import { handleStringChange, parseNumberOrString } from "./InputFormUtils";

interface Props {
    callback: Function;
    style?: CSSProperties;
}

export default observer(
    class FormClusterOptionsCard extends React.Component<Props> {
        state = {
            selectedAttribute: State.cluster.clusterBy,
            value: "" as string,
        };

        renderInput() {
            return (
                <>
                    <div style={{ marginTop: 10 }}>
                        <InputGroup
                            leftElement={<Icon icon="tag" />}
                            onChange={handleStringChange((value) => {
                                this.setState({ value: value });
                            })}
                            placeholder="Enter Clustering Value"
                            value={this.state.value}
                            intent={
                                this.state.value === ""
                                    ? Intent.DANGER
                                    : Intent.SUCCESS
                            }
                        />
                    </div>
                    <div className="horizontal-gap"></div>
                    <Button
                        onClick={() => {
                            this.props.callback(
                                this.state.selectedAttribute as string,
                                parseNumberOrString(this.state.value)
                            );
                        }}
                        intent={Intent.SUCCESS}
                        disabled={
                            this.state.selectedAttribute === null ||
                            this.state.value === ""
                        }
                    >
                        Confirm
                    </Button>
                </>
            );
        }

        render() {
            return (
                <>
                    <Card
                        elevation={Elevation.ONE}
                        style={{
                            background: Colors.DARK_GRAY3,
                        }}
                    >
                        <H6>(Optional) You can add node attributes here</H6>
                        <ClusterAdder
                            onCreate={(attribute) => {
                                this.setState({ selectedAttribute: attribute });
                            }}
                        />
                    </Card>
                    <div className="horizontal-gap"></div>
                    <Card elevation={Elevation.THREE}>
                        <H6>
                            Choose the Attribute and New Value to form the new
                            cluster
                        </H6>
                        <Callout
                            intent={
                                this.state.selectedAttribute === null
                                    ? Intent.DANGER
                                    : Intent.SUCCESS
                            }
                        >
                            <div style={{ display: "flex" }}>
                                <div
                                    style={{
                                        marginRight: 20,
                                        marginTop: 5,
                                        marginBottom: 10,
                                    }}
                                >
                                    Choose the Attribute
                                </div>

                                <ClusterChooser
                                    showNone={false}
                                    onSelect={(cluster) => {
                                        this.setState({
                                            selectedAttribute: cluster,
                                        });
                                    }}
                                    syncWith={this.state.selectedAttribute}
                                />
                            </div>
                        </Callout>
                        {this.renderInput()}
                    </Card>
                </>
            );
        }
    }
);
