import React from "react";
import classnames from "classnames";
import {
    Button,
    Classes,
    InputGroup,
    Intent,
    Position,
    Tooltip,
    Popover,
    Menu,
    MenuItem,
    MenuDivider,
} from "@blueprintjs/core";
import logo from "../images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import State from "../state/index";

import { GITHUB_URL, SAMPLE_GRAPH_SNAPSHOTS } from "../constants";

class Navbar extends React.Component {
    render() {
        return (
            <nav className={classnames([Classes.NAVBAR])}>
                <div
                    className={classnames([
                        Classes.NAVBAR_GROUP,
                        Classes.ALIGN_LEFT,
                    ])}
                >
                    <img
                        title="PiperNet"
                        id="PiperNet Logo"
                        src={logo}
                        width="35"
                        height="35"
                    ></img>
                    <div className={classnames([Classes.NAVBAR_HEADING])}>
                        {" "}
                        PiperNet{" "}
                    </div>

                    <Popover
                        content={
                            <Menu>
                                <MenuItem text="Load Sample" icon="graph">
                                    {SAMPLE_GRAPH_SNAPSHOTS.map((sample) => {
                                        const sampleSnapshotTitle = sample[0];
                                        const sampleSnapshotRawJson = sample[1];

                                        return (
                                            <MenuItem
                                                icon="graph"
                                                text={sampleSnapshotTitle}
                                                onClick={() => {
                                                    //TODO: add sample graphs for demo
                                                }}
                                            />
                                        );
                                    })}
                                </MenuItem>
                                <MenuDivider />
                                <MenuItem
                                    icon="import"
                                    text="Import from CSV..."
                                    onClick={() => {
                                        State.import.importCSVDialogOpen = true;
                                    }}
                                />
                                <MenuItem
                                    icon="import"
                                    text="Import from GEXF..."
                                    onClick={() => {
                                        State.import.importGEXFDialogOpen = true;
                                    }}
                                />
                                <MenuItem
                                    icon="document-open"
                                    text="Open Snapshot"
                                    onClick={() => {
                                        State.preferences.preferenceDialogOpen = true;
                                    }}
                                />
                                <MenuDivider />
                                <MenuItem
                                    icon="download"
                                    text="Save Snapshot"
                                    onClick={() => {
                                        State.project.saveSnapshotDialogOpen = true;
                                    }}
                                />
                            </Menu>
                        }
                        position={Position.BOTTOM}
                    >
                        <Button
                            className={classnames([
                                Classes.BUTTON,
                                Classes.MINIMAL,
                            ])}
                            icon="document"
                        >
                            Graph
                        </Button>
                    </Popover>
                    <Popover
                        content={
                            <Menu>
                                <MenuItem
                                    text="Data Sheet"
                                    icon="database"
                                    onClick={() => {
                                        // State.graph.frame.pauseLayout();
                                        State.preferences.dataSheetDialogOpen = true;
                                        this.forceUpdate();
                                    }}
                                />
                                <MenuItem
                                    text="Statistics"
                                    icon="timeline-bar-chart"
                                    onClick={() => {
                                        State.preferences.statisticsDialogOpen = true;
                                    }}
                                />
                            </Menu>
                        }
                        position={Position.BOTTOM}
                    >
                        <Button
                            className={classnames([
                                Classes.BUTTON,
                                Classes.MINIMAL,
                            ])}
                            icon="wrench"
                        >
                            Tools
                        </Button>
                    </Popover>
                </div>
                {/* <div
                    className={classnames([
                        Classes.NAVBAR_GROUP,
                        Classes.ALIGN_LEFT,
                    ])}
                >
                    <span className={Classes.NAVBAR_DIVIDER} />
                    {appState.graph.hasGraph && appState.graph.frame && (
                        <div style={{ display: "inline" }}>
                            <Tooltip
                                content={
                                    appState.graph.frame.paused
                                        ? "Resume Layout Algorithm"
                                        : "Pause Layout Algorithm"
                                }
                                position={Position.BOTTOM}
                            >
                                <Button
                                    className={classnames([
                                        Classes.BUTTON,
                                        Classes.MINIMAL,
                                    ])}
                                    icon={
                                        appState.graph.frame.paused
                                            ? "play"
                                            : "pause"
                                    }
                                    text={
                                        appState.graph.frame.paused
                                            ? "Resume Layout"
                                            : "Pause Layout"
                                    }
                                    onClick={() => {
                                        if (appState.graph.frame.paused) {
                                            appState.graph.frame.resumeLayout();
                                            this.forceUpdate();
                                        } else {
                                            appState.graph.frame.pauseLayout();
                                            this.forceUpdate();
                                        }
                                    }}
                                />
                            </Tooltip>
                        </div>
                    )}
                </div> */}
                <div
                    className={classnames([
                        Classes.NAVBAR_GROUP,
                        Classes.ALIGN_RIGHT,
                    ])}
                >
                    <Button
                        className={classnames([
                            Classes.BUTTON,
                            Classes.MINIMAL,
                        ])}
                        icon="graph"
                        onClick={() => {
                            State.project.renameSnapshotDialogOpen = true;
                        }}
                    >
                        {State.graph.metadata.snapshotName}
                    </Button>
                    <span className={Classes.NAVBAR_DIVIDER} />
                    <Button
                        className={classnames([
                            Classes.BUTTON,
                            Classes.MINIMAL,
                        ])}
                        icon="cog"
                        onClick={() => {
                            State.preferences.dialogOpen = true;
                        }}
                    />
                    <Button
                        className={classnames([
                            Classes.BUTTON,
                            Classes.MINIMAL,
                        ])}
                        icon="help"
                        onClick={() => {
                            State.preferences.helpDialogOpen = true;
                        }}
                    />
                    <span className={Classes.NAVBAR_DIVIDER} />
                    <a
                        href={GITHUB_URL}
                        target="_blank"
                        style={{
                            color: State.preferences.darkMode
                                ? "white"
                                : "black",
                            fontSize: "120%",
                            textDecoration: "none",
                        }}
                    >
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                </div>
            </nav>
        );
    }
}

export default Navbar;
