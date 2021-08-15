import React, { MouseEventHandler } from "react";
import { Button, Icon, InputGroup, Intent, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { observer } from "mobx-react";
import State from "../../state";
import { copy } from "copy-anything";
import { handleStringChange } from "./InputFormUtils";
import { createToaster } from "../../state/utils/ToasterUtils";

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

export default observer(
    /**
     * @description this component can be used to choose the attribute among all the attributes
     * with addition none to choose (can be toggled to off)
     *
     * to use it, you have to specify whether to add additional None to the list
     * and onChange function to call when a candidate is selected
     * @author Zichen XU
     * @class ClusterChooser
     * @extends {React.Component<Props, {}>}
     */
    class ClusterChooser extends React.Component<Props, {}> {
        static defaultProps = {
            showNone: true,
        };

        get fullProperties(): string[] {
            let propertiesWithNone = copy(State.graph.metadata.nodeProperties);
            propertiesWithNone.unshift("None");
            return propertiesWithNone;
        }

        itemRenderer = (
            item: any,
            props: CustomIItemRendererProps
        ): JSX.Element | null => {
            if (item === "None") {
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
                        let selected = item === "None" ? null : item;
                        this.props.onSelect(selected);
                    }}
                    {...this.props}
                >
                    <Button
                        text={this.props.syncWith ?? this.fullProperties[0]}
                    />
                </Select>
            );
        }
    }
);

interface Props2 {
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

export const HierarchyLevelChooser = observer(
    class HierarchyLevelChooser extends React.Component<Props2,{}>{

        get hierarchylevels() {
            let arr : string[] = [];
            let totallevel = State.import.colorMap?.size;
            if (totallevel != undefined){
              
            for (let i : number = 0; i<totallevel-1; i++) {
                arr.push(i.toString());
            }
            return arr;

            }   
        }

        itemRenderer = (
            item: any,
            props: CustomIItemRendererProps
        ): JSX.Element | null => {
            if (item === "None") {
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
                        this.hierarchylevels? 
                            this.hierarchylevels : ["None"]
                    }
                    itemRenderer={this.itemRenderer}
                    filterable={false}
                    onItemSelect={(item: string) => {
                        let selected = item === "None" ? null : item;
                        this.props.onSelect(selected);
                    }}
                    {...this.props}
                >
                    <Button
                        text={this.props.syncWith}
                    />
                </Select>
            );
        }
    }
);

interface ClusterAdderProps {
    onCreate: (attribute: string) => void;
}

export const ClusterAdder = observer(
    class ClusterAdder extends React.Component<ClusterAdderProps> {
        state = {
            attribute: "",
        };

        render() {
            return (
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <InputGroup
                        leftElement={<Icon icon="tag" />}
                        onChange={handleStringChange((value) => {
                            this.setState({ attribute: value });
                        })}
                        placeholder="New Attribute Name"
                        fill={true}
                        value={this.state.attribute}
                    />
                    <Button
                        onClick={() => {
                            if (
                                this.state.attribute === "" ||
                                State.graph.metadata.nodeProperties.includes(
                                    this.state.attribute
                                )
                            ) {
                                createToaster(
                                    `Attribute name ${this.state.attribute} already exists`,
                                    undefined,
                                    undefined,
                                    Intent.DANGER
                                );
                                return;
                            }
                            State.graph.metadata.nodeProperties.push(
                                this.state.attribute
                            );
                            State.graph.rawGraph.forEachNode(
                                (_, attributes) => {
                                    attributes[this.state.attribute] = "";
                                }
                            );
                            this.props.onCreate(this.state.attribute);
                            this.setState({ attributes: "" });
                        }}
                        intent={Intent.PRIMARY}
                    >
                        Add
                    </Button>
                </div>
            );
        }
    }
);
