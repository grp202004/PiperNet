import { MenuItem, MenuItemProps } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";

interface TooltipProps {
    tooltipText: string;
}

type Props = TooltipProps & MenuItemProps;

export function MenuItemWithTooltip(props: Props) {
    return (
        <Tooltip2 content={props.tooltipText}>
            <MenuItem {...props} />
        </Tooltip2>
    );
}
