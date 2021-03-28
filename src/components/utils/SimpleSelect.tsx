import React, { MouseEventHandler } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, Select } from "@blueprintjs/labs";
import { observer } from "mobx-react";

interface Props {
    items: any[];
    onSelect: (
        item: any,
        event?: React.SyntheticEvent<HTMLElement, Event> | undefined
    ) => void;
    text: string;
    small: boolean;
    search: boolean;
}

export interface CustomIItemRendererProps {
    handleClick: MouseEventHandler<HTMLElement>;
}

export function CommonItemRenderer(
    item: any,
    props: CustomIItemRendererProps
): JSX.Element | null {
    return <MenuItem key={item} onClick={props.handleClick} text={item} />;
}

export default observer(
    class SimpleSelect extends React.Component<Props, {}> {
        static defaultProps = {
            small: false,
            search: false,
        };

        itemPredicate: ItemPredicate<string> = (
            query: string,
            object: string
        ) => {
            return object.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        };
        render() {
            if (this.props.search) {
                return (
                    <Select
                        items={this.props.items}
                        itemPredicate={this.itemPredicate}
                        itemRenderer={CommonItemRenderer}
                        filterable={true}
                        onItemSelect={this.props.onSelect}
                        noResults={
                            <MenuItem disabled={true} text="No results." />
                        }
                    >
                        <Button
                            text={this.props.text}
                            small={this.props.small}
                        />
                    </Select>
                );
            } else {
                return (
                    <Select
                        items={this.props.items}
                        itemRenderer={CommonItemRenderer}
                        filterable={false}
                        onItemSelect={this.props.onSelect}
                    >
                        <Button
                            text={this.props.text}
                            small={this.props.small}
                        />
                    </Select>
                );
            }
        }
    }
);
