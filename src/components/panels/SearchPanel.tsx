import React from "react";
import { observer } from "mobx-react";
import State from "../../state";
import { InputGroup, Menu, MenuItem } from "@blueprintjs/core";
import classnames from "classnames";
import { handleStringChange } from "../utils/InputFormUtils";

export default observer(
    class SearchPanel extends React.Component {
        renderSearchResults = () => {
            return State.search.candidates.map((it) => {
                return (
                    <MenuItem
                        text={it}
                        onMouseOver={() => {
                            State.search.isPreviewing = true;
                            State.interaction.currentlyHoveredNodeId = it;
                            State.graphDelegate.cameraFocusOn(it);
                        }}
                    />
                );
            });
        };

        render() {
            return (
                <div
                    className={classnames(
                        "bottom-overlay-card",
                        "transparent-frame"
                    )}
                >
                    <div className={classnames("search")}>
                        {State.search.candidates.length !== 0 && (
                            <Menu
                                large={true}
                                className={classnames("search-menu")}
                                onMouseLeave={() => {
                                    State.search.isPreviewing = false;
                                }}
                            >
                                {this.renderSearchResults()}
                            </Menu>
                        )}
                        <InputGroup
                            asyncControl={true}
                            large={true}
                            leftIcon="search"
                            onChange={handleStringChange(
                                (value) => (State.search.searchStr = value)
                            )}
                            placeholder="Search any Node..."
                            value={State.search.searchStr}
                        />
                    </div>
                </div>
            );
        }
    }
);
// export default EdgesPanel;
