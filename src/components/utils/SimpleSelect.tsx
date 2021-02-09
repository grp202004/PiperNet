import React, { MouseEventHandler } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/labs";
import { observer } from "mobx-react";

interface Props {
    items: any[];
    onSelect: (
        item: any,
        event?: React.SyntheticEvent<HTMLElement, Event> | undefined
    ) => void;
    text: string;
}

interface CustomIItemRendererProps {
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
        render() {
            return (
                <Select
                    items={this.props.items}
                    itemRenderer={CommonItemRenderer}
                    filterable={false}
                    onItemSelect={this.props.onSelect}
                >
                    <Button text={this.props.text} />
                </Select>
            );
        }
    }
);
