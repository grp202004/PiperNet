import React from "react";
import { Classes, Menu } from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../../state";
import { computed, makeObservable } from "mobx";
import RightClickNodeMenu from "./RightClickNodeMenu";
import RightClickClusterMenu from "./RightClickClusterMenu";
import RightClickBackgroundMenu from "./RightClickBackgroundMenu";

interface Props {
    /**
     * what place this RightClick interaction is activated
     *
     * @type {("Node" | "Cluster" | "Background")}
     */
    on: "Node" | "Cluster" | "Background";
}

export default observer(
    /**
     * @description This component will be used when mouse right-clicked. There will be some operation choices on this panel.
     * @author Zichen XU, Zhiyuan LYU
     * @extends {React.Component}
     */
    class RightClickPanel extends React.Component<Props, {}> {
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

        renderMenuContent() {
            switch (this.props.on) {
                case "Node":
                    return <RightClickNodeMenu />;
                case "Cluster":
                    return <RightClickClusterMenu />;
                case "Background":
                    return <RightClickBackgroundMenu />;
            }
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
                    {this.renderMenuContent()}
                </Menu>
            );
        }
    }
);
