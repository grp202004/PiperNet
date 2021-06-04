import React from "react";
import { MenuDivider } from "@blueprintjs/core";
import { observer } from "mobx-react";
import State from "../../../state";
import { MenuItemWithTooltip } from "../../utils/MenuItemWithTooltip";

export default observer(
    /**
     * @description This component will be used when mouse right-clicked. There will be some operation choices on this panel.
     * @author Zichen XU, Zhiyuan LYU
     * @extends {React.Component}
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
