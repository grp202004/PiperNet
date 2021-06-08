import React from "react";
import { MenuDivider } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../../state";
import { MenuItemWithTooltip } from "../../utils/MenuItemWithTooltip";

export default observer(
    /**
     * @description sub component to render options for RightClickBackgroundPanel
     * @author Zichen XU, Zhiyuan LYU
     */
    class RightClickBackgroundPanel extends React.Component {
        render() {
            return (
                <>
                    <MenuDivider title="Edit Graph" />
                    <MenuItemWithTooltip
                        tooltipText="Add single node to the graph"
                        icon="new-object"
                        text="Add Node"
                        onClick={() => {
                            State.preferences.AddNodeDialogOpen = true;
                            State.preferences.rightClickPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                </>
            );
        }
    }
);
