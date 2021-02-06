import React from "react";
import { observer } from "mobx-react";
import classnames from "classnames";
import {
    Button,
    Classes,
    ButtonGroup,
    Position,
    Popover,
    Menu,
    MenuItem,
    MenuDivider,
} from "@blueprintjs/core";
import SimpleSelect from "./utils/SimpleSelect";
import logo from "../images/logo.png";
import State from "../state";

export default observer(
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
                                    <MenuItem
                                        text="Load Sample"
                                        icon="graph"
                                        onClick={() => {
                                            State.import.importSamplesDialogOpen = true;
                                        }}
                                    >
                                        {/* {SAMPLE_GRAPH_SNAPSHOTS.map(
                                            (sample) => {
                                                const sampleSnapshotTitle =
                                                    sample[0];
                                                const sampleSnapshotUrl =
                                                    sample[1];

                                                return (
                                                    <MenuItem
                                                        icon="graph"
                                                        text={
                                                            sampleSnapshotTitle
                                                        }
                                                        disabled={true}
                                                        onClick={() => {
                                                            fetchSampleGraph(
                                                                sampleSnapshotUrl
                                                            ).then((file) => {
                                                                State.import.selectedGEXFFileFromInput = file;
                                                                State.import
                                                                    .importGraphFromGEXF()
                                                                    .then(
                                                                        (
                                                                            res
                                                                        ) => {
                                                                            State.graph.rawGraph =
                                                                                res.graph;
                                                                            State.graph.metadata =
                                                                                res.metadata;
                                                                        }
                                                                    );
                                                            });
                                                        }}
                                                    />
                                                );
                                            }
                                        )} */}
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
                                    <MenuDivider />
                                    <MenuItem
                                        icon="download"
                                        text="Export Graph"
                                        onClick={() => {
                                            State.project.exportDialogOpen = true;
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
                                        text="Node DataSheet"
                                        icon="ungroup-objects"
                                        onClick={() => {
                                            State.preferences.nodeDataSheetDialogOpen = true;
                                        }}
                                    />
                                    <MenuItem
                                        text="Edge DataSheet"
                                        icon="link"
                                        onClick={() => {
                                            State.preferences.edgeDataSheetDialogOpen = true;
                                        }}
                                    />
                                    {/* <MenuItem
                                        text="Statistics"
                                        icon="timeline-bar-chart"
                                        onClick={() => {
                                            State.preferences.statisticsDialogOpen = true;
                                        }}
                                    /> */}
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
                    <ButtonGroup>
                        {/* <SimpleSelect
                            className={classnames([Classes.ALERT_CONTENTS])}
                            items={["3D", "2D"]}
                            value={State.preferences.view}
                            onSelect={(it) => (State.preferences.view = it)}
                        />
                        <Divider /> */}
                    </ButtonGroup>

                    <div
                        className={classnames([
                            Classes.NAVBAR_GROUP,
                            Classes.ALIGN_RIGHT,
                        ])}
                    >
                        Clustered by{"  "}
                        <SimpleSelect
                            items={
                                State.graph.metadata.nodeProperties.length == 0
                                    ? ["None"]
                                    : State.graph.metadata.nodeProperties
                            }
                            value={State.cluster.clusterBy}
                            onSelect={(it: string) =>
                                (State.cluster.clusterBy = it)
                            }
                        />
                        <span className={Classes.NAVBAR_DIVIDER} />
                        <Button
                            className={classnames([
                                Classes.BUTTON,
                                Classes.MINIMAL,
                            ])}
                            icon="cog"
                            disabled={true}
                            onClick={() => {
                                State.preferences.preferenceDialogOpen = true;
                            }}
                        />
                        <Button
                            className={classnames([
                                Classes.BUTTON,
                                Classes.MINIMAL,
                            ])}
                            icon="code"
                            onClick={() => {
                                window.open(
                                    "https://github.com/grp202004/PiperNet"
                                );
                            }}
                        />
                    </div>
                </nav>
            );
        }
    }
);
