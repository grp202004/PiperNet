import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { Button, ControlGroup, MenuItem } from "@blueprintjs/core";
import { Select, Suggest } from "@blueprintjs/select";
import { CustomIItemRendererProps } from "../utils/SimpleSelect";
import { Tooltip2 } from "@blueprintjs/popover2";
import { stringifyNodeDetail } from "../utils/InputFormUtils";

interface IFilterOption {
    text: React.ReactNode;
    disabled: boolean;
    attribute?: string;
}

export default observer(
    class SearchPanel extends React.Component {
        get FILTER_OPTIONS(): IFilterOption[] {
            let prefix: IFilterOption[] = [
                { text: "ID includes", disabled: false },
                { text: <b>Or Search Attributes</b>, disabled: true },
            ];
            State.graph.metadata.nodeProperties.forEach((it) =>
                prefix.push({
                    text: `Attribute: ${it}`,
                    disabled: false,
                    attribute: it,
                })
            );
            return prefix;
        }

        state = {
            filter: "ID includes" as string,
        };

        private itemRenderer(
            item: IFilterOption,
            props: CustomIItemRendererProps
        ): JSX.Element | null {
            return (
                <MenuItem
                    key={item.text?.toString()}
                    disabled={item.disabled}
                    onClick={props.handleClick}
                    text={item.text}
                />
            );
        }

        render() {
            return (
                <div>
                    <ControlGroup>
                        <Select
                            items={this.FILTER_OPTIONS}
                            itemRenderer={this.itemRenderer}
                            filterable={false}
                            onItemSelect={(item) => {
                                this.setState({
                                    filter: item.text,
                                });
                                State.search.filterProps =
                                    item.attribute ?? null;
                            }}
                        >
                            <Button icon="filter">{this.state.filter}</Button>
                        </Select>
                        <Suggest
                            inputValueRenderer={(a) => a}
                            query={State.search.searchStr}
                            onQueryChange={(value) =>
                                (State.search.searchStr = value)
                            }
                            itemListPredicate={() => State.search.candidates}
                            itemRenderer={(value: string) => (
                                <Tooltip2
                                    usePortal={false}
                                    content={stringifyNodeDetail(
                                        State.graph.rawGraph.getNodeAttributes(
                                            value
                                        )
                                    )}
                                >
                                    <MenuItem
                                        text={value}
                                        onMouseOver={() => {
                                            State.search.isPreviewing = true;
                                            State.interaction.currentlyHoveredNodeId = value;
                                            State.graphDelegate.cameraFocusOn(
                                                value
                                            );
                                        }}
                                        onMouseLeave={() => {
                                            State.search.isPreviewing = false;
                                        }}
                                    />
                                </Tooltip2>
                            )}
                            items={State.search.candidates}
                            openOnKeyDown={true}
                            noResults={
                                <MenuItem disabled={true} text="No results." />
                            }
                            popoverProps={{ minimal: true }}
                        />
                    </ControlGroup>
                </div>
            );
        }
    }
);
