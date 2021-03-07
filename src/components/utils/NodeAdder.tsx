import {
    Button,
    Card,
    Elevation,
    FormGroup,
    H5,
    InputGroup,
    Tooltip,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import React from "react";
import State from "../../state";
import { Attributes } from "graphology-types";
import { handleStringChange, parseNumberOrString } from "./InputFormUtils";

/**
 *
 * @interface Props
 */
interface Props {
    /**
     * function to call when a new node is successfully added
     * the {nodeId} is the id of the newly added node, {attributes} is the attributes of the newly added node
     *
     * @memberof Props
     */
    onAdded: (nodeId: string, attributes: Attributes) => void;
}

export default observer(
    class NodeAdder extends React.Component<Props, {}> {
        state = {
            newNodeId: "",
            attributes: {} as Attributes,
        };

        get canImport() {
            return (
                !State.graph.rawGraph.hasNode(this.state.newNodeId) &&
                this.state.newNodeId !== ""
            );
        }

        canImportTag = () => {
            return this.canImport ? (
                <Tooltip
                    content={
                        "This Node Id is not used by any existing node yet"
                    }
                    intent="success"
                >
                    <Button icon="tick" intent="success" minimal={true} />
                </Tooltip>
            ) : (
                <Tooltip
                    content={
                        "This Node Id is currently in use by other nodes, try with another one instead"
                    }
                    intent="warning"
                >
                    <Button icon="cross" intent="warning" minimal={true} />
                </Tooltip>
            );
        };

        renderAttributesForm = (attributes: string[]) => {
            return attributes.map((attribute) => {
                if (attribute !== "_options" && attribute !== "_visualize") {
                    return (
                        <FormGroup label={attribute}>
                            <InputGroup
                                asyncControl={true}
                                placeholder={
                                    "Enter the value for attribute: " +
                                    attribute
                                }
                                onChange={handleStringChange((value) => {
                                    let newValue = this.state.attributes;
                                    newValue[attribute] = parseNumberOrString(
                                        value
                                    );
                                    this.setState({ attributes: newValue });
                                })}
                                value={this.state.attributes[attribute]}
                            />
                        </FormGroup>
                    );
                } else {
                    return null;
                }
            });
        };

        render() {
            return (
                <Card elevation={Elevation.ONE}>
                    <FormGroup label="New Node ID" labelInfo="(required)">
                        <InputGroup
                            autoFocus={true}
                            asyncControl={true}
                            placeholder="Enter the new Node Id..."
                            intent={this.canImport ? "success" : "warning"}
                            rightElement={this.canImportTag()}
                            onChange={handleStringChange((value) =>
                                this.setState({ newNodeId: value })
                            )}
                            value={this.state.newNodeId}
                        />
                    </FormGroup>
                    <Card elevation={Elevation.ONE}>
                        <H5>Attributes</H5>
                        {this.renderAttributesForm(
                            State.graph.metadata.nodeProperties
                        )}
                    </Card>
                    <hr />
                    <Button
                        intent="primary"
                        onClick={() => {
                            State.graph.decorateRawNode(
                                this.state.newNodeId,
                                this.state.attributes
                            );
                            State.graph.mutating.addNode(
                                this.state.newNodeId,
                                this.state.attributes
                            );
                            this.props.onAdded(
                                this.state.newNodeId,
                                this.state.attributes
                            );
                            State.preferences.AddNodeDialogOpen = false;
                            // State.preferences.rightClickBackgroundPanelOpen = false;
                            // this.forceUpdate();
                            // State.graphDelegate.cameraFocusOn(this.state.newNodeId);
                        }}
                        disabled={!this.canImport}
                    >
                        Confirm
                    </Button>
                </Card>
            );
        }
        componentDidMount = () => {
            State.graph.metadata.nodeProperties.forEach((prop) => {
                let newValue = this.state.attributes;
                newValue[prop] = "";
                this.setState({ attributes: newValue });
            });
        };
    }
);
