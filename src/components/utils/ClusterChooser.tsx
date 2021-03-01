import React, { MouseEventHandler } from "react";
import { Button, FormGroup, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { observer } from "mobx-react";
import State from "../../state";
import { copy } from "copy-anything";

interface Props {
    /**
     * whether or not to show the None
     *
     * @type {string}
     * @memberof Props
     */
    showNone: boolean;

    /**
     * function to call when a candidate is selected, will be called on every selection of candidate
     * if None is selected, the item props will be set to null
     *
     * @memberof Props
     */
    onSelect: (item: string | null) => void;

    /**
     * the selected to display will sync with this props
     *
     * @type {(string | null)}
     * @memberof Props
     */
    syncWith: string | null;
}

interface CustomIItemRendererProps {
    handleClick: MouseEventHandler<HTMLElement>;
}

/**
 * this component can be used to choose the attribute among all the attributes, with addition none to choose (can be toggled to off)
 * to use it, you have to specify whether to add additional None to the list and onChange function to call when a candidate is selected
 */
export default observer(
    class ClusterChooser extends React.Component<Props, {}> {
        static defaultProps = {
            showNone: true,
        };

        get fullProperties(): string[] {
            let propertiesWithNone = copy(State.graph.metadata.nodeProperties);
            if (State.graph.rawGraph.hasAttribute('cluster')){
                propertiesWithNone.unshift(State.graph.rawGraph.getAttribute('cluster'));
                propertiesWithNone.unshift("None");
            }else{
            propertiesWithNone.unshift("None");}
            return propertiesWithNone;
        }

        itemRenderer = (
            item: any,
            props: CustomIItemRendererProps
        ): JSX.Element | null => {
            if (item == "None") {
                return (
                    <MenuItem
                        intent="primary"
                        key={item}
                        onClick={props.handleClick}
                        text={item}
                    />
                );
            } else {
                return (
                    <MenuItem
                        key={item}
                        onClick={props.handleClick}
                        text={item}
                    />
                );
            }
        };

        render() {
            return (
                <Select
                    items={
                        this.props.showNone
                            ? this.fullProperties
                            : State.graph.metadata.nodeProperties
                    }
                    itemRenderer={this.itemRenderer}
                    filterable={false}
                    onItemSelect={(item: string) => {
                        // let selected : string | null
                        // if (State.graph.rawGraph.hasAttribute('cluster')){
                        //     selected = State.graph.rawGraph.getAttribute('cluster')
                        // }else{
                        //     selected = item === "None" ? null : item;
                        // }
                        let selected = item === "None" ? null : item;
                        this.props.onSelect(selected);
                    }}
                >
                    <Button text={this.props.syncWith ?? this.fullProperties[0]} />
                </Select>
            );
        }
    }
);
