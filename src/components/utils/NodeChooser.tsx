import React from "react";
import { Button, FormGroup, MenuItem, Tooltip } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { Attributes, SerializedNode } from "graphology-types";
import { observer } from "mobx-react";
import State from "../../state";
import { stringifyNodeDetail } from "./InputFormUtils";

/**
 *
 * @interface Props
 */
interface Props {
    /**
     * the text to be shown above the selectButton
     *
     * @type {string}
     * @memberof Props
     */
    text: string;

    /**
     * function to call when a candidate is selected, will be called on every selection of candidate
     * the {nodeId} is the id of the selected node
     *
     * @memberof Props
     */
    onChange: (nodeId: string) => void;
}

/**
 * this component can be used to choose the node among all the nodes, with basic search filters available
 * to use it, you have to specify the text shown above the selectButton as well as the onChange function to call when a candidate is selected
 */
export default observer(
    class NodeChooser extends React.Component<Props, {}> {
        state = {
            select: "Choose " + this.props.text,
        };

        render() {
            return (
                <FormGroup
                    label={this.props.text}
                    labelFor="text-input"
                    labelInfo="(required)"
                >
                    <Select
                        filterable={true}
                        items={State.graph.rawGraph.export().nodes}
                        itemPredicate={(
                            query: string,
                            item: SerializedNode<Attributes>
                        ) => {
                            return item.key.includes(query);
                        }}
                        itemRenderer={(item: SerializedNode<Attributes>) => {
                            return (
                                <Tooltip
                                    content={stringifyNodeDetail(
                                        item.attributes ?? {}
                                    )}
                                >
                                    <MenuItem
                                        key={item.key}
                                        text={item.key}
                                        onClick={() => {
                                            let key = item.key;
                                            this.setState({ select: key });
                                            this.props.onChange(key);
                                        }}
                                    />
                                </Tooltip>
                            );
                        }}
                        noResults={
                            <MenuItem disabled={true} text="No results." />
                        }
                        onItemSelect={() => {}}
                    >
                        <Button
                            text={this.state.select}
                            rightIcon="double-caret-vertical"
                        />
                    </Select>
                </FormGroup>
            );
        }
    }
);
