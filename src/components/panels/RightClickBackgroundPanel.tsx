import React from "react";
import { Menu, MenuItem, MenuDivider, Classes } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import { computed, makeObservable } from "mobx";

export default observer(
    class RightClickBackgroundPanel extends React.Component {
        constructor(props: any) {
            super(props);
            makeObservable(this, {
                stylePosition: computed,
            });
        }
        get stylePosition() {
            return {
                top: State.preferences.rightClickPositionY + 10 + "px",
                left: State.preferences.rightClickPositionX + 10 + "px",
            };
        }

        render() {
            return (
                <Menu
                    className={classnames(
                        Classes.ELEVATION_1,
                        "right-click-panel"
                    )}
                    style={this.stylePosition}
                >
                    <MenuItem
                        icon="new-object"
                        text="Add Node"
                        onClick={() => {
                            State.preferences.AddNodeDialogOpen = true;
                            State.preferences.rightClickBackgroundPanelOpen = false;
                        }}
                    />
                    <MenuDivider />
                </Menu>
            );
        }
    }
);
