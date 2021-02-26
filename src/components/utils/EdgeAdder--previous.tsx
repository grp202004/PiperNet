import {
    Button,
    Card,
    Elevation,
    FormGroup,
    H5,
    InputGroup,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { observer } from "mobx-react";
import React from "react";
import State from "../../state";
import { Attributes } from "graphology-types";
import { handleStringChange, parseNumberOrString } from "./InputFormUtils";

/**
 *
 * @interface Props
 */
// interface Props {
//     /**
//      * function to call when a new node is successfully added
//      * the {nodeId} is the id of the newly added node, {attributes} is the attributes of the newly added node
//      *
//      * @memberof Props
//      */
//     onAdded: (nodeId: string, attributes: Attributes) => void;
// }

export default observer(
    class EdgeAdder extends React.Component {
        state = {
            newNodeId: "",
            source: "",
            target: "",
            attributes: {} as Attributes,
        };

        get canImport() {
            return (
                // !State.graph.rawGraph.hasNode(this.state.newNodeId) &&
                // this.state.newNodeId !== ""
                !State.graph.rawGraph.hasEdge(this.state.source, this.state.target) &&
                this.isFirstNodeVlaid &&
                this.isSecondNodeVlaid
            );
        }
        get isFirstNodeVlaid() {
            return this.state.source !== "" && State.graph.rawGraph.hasNode(this.state.source)
        }

        get isSecondNodeVlaid() {
            return this.state.target !== "" && State.graph.rawGraph.hasNode(this.state.target)
        }

        canImportTag = () => {
            return this.canImport ? (
                <Tooltip2
                    content={
                        "This edge can be create"
                    }
                    intent="success"
                >
                    <Button icon="tick" intent="success" minimal={true} />
                </Tooltip2>
            ) : (
                    <Tooltip2
                        content={
                            "This edge is existed"
                        }
                        intent="warning"
                    >
                        <Button icon="cross" intent="warning" minimal={true} />
                    </Tooltip2>
                );
        };

        isFirstNodeVlaidTag = () => {
            return this.isFirstNodeVlaid ? (
                <Tooltip2
                    content={
                        "The input is valid"
                    }
                    intent="success"
                >
                    <Button icon="tick" intent="success" minimal={true} />
                </Tooltip2>
            ) : (
                    <Tooltip2
                        content={
                            "The node is not existed"
                        }
                        intent="warning"
                    >
                        <Button icon="cross" intent="warning" minimal={true} />
                    </Tooltip2>
                );
        }

        isSecondNodeVlaidTag = () => {
            return this.isSecondNodeVlaid ? (
                <Tooltip2
                    content={
                        "The input is valid"
                    }
                    intent="success"
                >
                    <Button icon="tick" intent="success" minimal={true} />
                </Tooltip2>
            ) : (
                    <Tooltip2
                        content={
                            "The node is not existed"
                        }
                        intent="warning"
                    >
                        <Button icon="cross" intent="warning" minimal={true} />
                    </Tooltip2>
                );
        }

        //the attributes of edge when creating are not needed currently 
        // 
        // renderAttributesForm = (attributes: string[]) => {
        //     return attributes.map((attribute) => {
        //         if (attribute !== "_options" && attribute !== "_visualize") {
        //             return (
        //                 <FormGroup label={attribute}>
        //                     <InputGroup
        //                         asyncControl={true}
        //                         placeholder={
        //                             "Enter the value for attribute: " +
        //                             attribute
        //                         }
        //                         onChange={handleStringChange((value) => {
        //                             let newValue = this.state.attributes;
        //                             newValue[attribute] = parseNumberOrString(
        //                                 value
        //                             );
        //                             this.setState({ attributes: newValue });
        //                         })}
        //                         value={this.state.attributes[attribute]}
        //                     />
        //                 </FormGroup>
        //             );
        //         } else {
        //             return null;
        //         }
        //     });
        // };


        render() {
            return (
                <Card elevation={Elevation.ONE}>
                    <FormGroup label="Node" labelInfo="(required)">
                        <InputGroup
                            autoFocus={true}
                            asyncControl={true}
                            placeholder="Enter the  Node Id..."
                            intent={this.isFirstNodeVlaid ? "success" : "warning"}
                            rightElement={(this.isFirstNodeVlaid && this.isSecondNodeVlaid) ? this.canImportTag() : this.isFirstNodeVlaidTag()}
                            onChange={handleStringChange((value) =>
                                this.setState({ source: value })
                            )}
                            value={this.state.source}
                        />
                    </FormGroup>

                    <FormGroup label="Node" labelInfo="(required)">
                        <InputGroup
                            autoFocus={true}
                            asyncControl={true}
                            placeholder="Enter the  Node Id..."
                            intent={this.isSecondNodeVlaid ? "success" : "warning"}
                            rightElement={(this.isFirstNodeVlaid && this.isSecondNodeVlaid) ? this.canImportTag() : this.isSecondNodeVlaidTag()}
                            onChange={handleStringChange((value) =>
                                this.setState({ target: value })
                            )}
                            value={this.state.target}
                        />
                    </FormGroup>
                    {/* attributes of edge */}
                    {/* <Card elevation={Elevation.ONE}>
                        <H5>Attributes</H5>
                        {this.renderAttributesForm(
                            State.graph.metadata.nodeProperties
                        )}
                    </Card> */}
                    <hr />
                    <Button
                        intent="primary"
                        onClick={() => {
                            // State.graph.decorateRawNode(
                            //     this.state.newNodeId,
                            //     this.state.attributes
                            // );
                            State.graph.rawGraph.addEdge(
                                this.state.source,
                                this.state.target
                            );
                            // this.props.onAdded(
                            //     this.state.newNodeId,
                            //     this.state.attributes
                            // );
                            State.preferences.AddEdgeDialogOpen = false;
                        }}

                        disabled={!this.canImport}
                    >
                        Confirm
                    </Button>
                </Card>
            );
        }
        // componentDidMount = () => {
        //     State.graph.metadata.nodeProperties.forEach((prop) => {
        //         let newValue = this.state.attributes;
        //         newValue[prop] = "";
        //         this.setState({ attributes: newValue });
        //     });
        // };
    }
);
