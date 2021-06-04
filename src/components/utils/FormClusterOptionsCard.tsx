import React from "react";
import {
    Button,
    Callout,
    Card,
    Elevation,
    H6,
    Icon,
    InputGroup,
    Intent,
    MenuDivider,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../state";
import ClusterChooser, { ClusterAdder } from "./ClusterChooser";
import { handleStringChange } from "./InputFormUtils";

interface Props {
    callback: (attribute: string, value: number | string) => void;
}

export default observer(
    /**
     * @description the wrapper for data sheet dialog, provides a loading state before the data shows
     * @author Zichen XU
     * @class DataSheetDialogWrapper
     * @extends {React.Component<Props, {}>}
     */
    class FormClusterOptionsCard extends React.Component<Props> {
        state = {
            selectedAttribute: State.cluster.clusterBy,
            value: "" as string,
        };

        render() {
            return (
                <Card>
                    <H6>(Optional) You can add node attributes here</H6>
                    <ClusterAdder
                        onCreate={(attribute) => {
                            this.setState({ selectedAttribute: attribute });
                        }}
                    />
                    <MenuDivider />
                    <div style={{ marginBottom: "20px" }} />

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
                        <Button
                            onClick={() => {
                                this.props.callback(
                                    this.state.selectedAttribute as string,
                                    this.state.value
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
                    </Card>
                </Card>
            );
        }
    }
);
