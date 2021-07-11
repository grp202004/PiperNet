import React from "react";
import { observer } from "mobx-react";
import {
    Button,
    Menu,
    MenuDivider,
    MenuItem,
    Position,
    Switch,
    Navbar as BlueprintNavbar,
    NavbarGroup,
    Alignment,
    NavbarHeading,
    NavbarDivider,
} from "@blueprintjs/core";
import ClusterChooser from "./utils/ClusterChooser";
import logo from "../images/icon.png";
import State from "../state";
import { Popover2 } from "@blueprintjs/popover2";
import SearchPanel from "./panels/SearchPanel";
import * as THREE from "three";
import cluster3d from "../state/Cluster3dObjectStore";

export default observer(
    /**
     * @description the navigation bar on the top
     * @author Zichen XU
     * @class Navbar
     * @extends {React.Component}
     */
    class Navbar extends React.Component {
        threeScene!: THREE.Scene;
        render() {
            return (
                <BlueprintNavbar
                    //@ts-ignore
                    style={{ zIndex: 2 }}
                >
                    <NavbarGroup align={Alignment.LEFT}>
                        <img
                            title="ClusterGrapher"
                            id="ClusterGrapher Logo"
                            src={logo}
                            width="35"
                            height="35"
                            alt="ClusterGrapher Logo"
                        />
                        <MenuDivider />
                        <NavbarHeading>ClusterGrapher</NavbarHeading>
                        <Popover2
                            content={
                                <Menu>
                                    <MenuItem
                                        icon="import"
                                        text="Open GEXF"
                                        onClick={() => {
                                            State.import.importGEXFDialogOpen = true;
                                        }}
                                    />
                                    <MenuItem
                                        text="Import from CSV"
                                        icon="import"
                                        onClick={() => {
                                            State.import.importDialogOpen = true;
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
                                    <MenuItem
                                        text="Load Sample"
                                        icon="import"
                                        onClick={()=>{
                                            let material = new THREE.MeshBasicMaterial({
                                                color:0xFF6060,
                                                transparent: true,
                                                opacity: 0.1
                                            });

                                            let material2 = new THREE.MeshBasicMaterial({
                                                color:0xFF6060,
                                                transparent: true,
                                                opacity: 0.3
                                            });

                                            let sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 100, 100), material);
                                            sphere.material.side = THREE.DoubleSide;
                                            sphere.material.depthWrite = false;

                                            let sphere2 = new THREE.Mesh(new THREE.SphereGeometry(80, 100, 100), material);
                                            sphere2.material.side = THREE.DoubleSide;
                                            sphere2.material.depthWrite = false;
                                            
                                            State.graphDelegate.clusterObject.threeScene.add(sphere);
                                        }}
                                    />
                                    <MenuDivider />
                                    <MenuItem
                                        icon="download"
                                        text="Export Graph"
                                        onClick={() => {
                                            State.preferences.exportDialogOpen = true;
                                        }}
                                    />
                                </Menu>
                            }
                            placement={Position.BOTTOM}
                        >
                            <Button minimal={true} icon="document">
                                Graph
                            </Button>
                        </Popover2>
                        <Popover2
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
                                </Menu>
                            }
                            placement={Position.BOTTOM}
                        >
                            <Button minimal={true} icon="wrench">
                                Tools
                            </Button>
                        </Popover2>
                        <Switch
                            style={{ marginTop: 10, marginLeft: 8 }}
                            label="Graph Animation"
                            checked={State.css.isAnimating}
                            onChange={() =>
                                (State.css.isAnimating = !State.css.isAnimating)
                            }
                        />
                    </NavbarGroup>

                    {/* <ButtonGroup>
                        <SimpleSelect
                            className={classnames([Classes.ALERT_CONTENTS])}
                            items={["3D", "2D"]}
                            value={State.preferences.view}
                            onSelect={(it) => (State.preferences.view = it)}
                        />
                        <Divider />
                    </ButtonGroup> */}
                    

                    <NavbarGroup align={Alignment.RIGHT}>
                        <SearchPanel />
                        <NavbarDivider />
                        <div style={{ marginRight: 6 }}>Clustered by</div>
                        <ClusterChooser
                            onSelect={(cluster) => {
                                State.cluster.setCluster(cluster);
                            }}
                            syncWith={State.cluster.clusterBy}
                        />
                        {/* <NavbarDivider />
                        <SimpleSelect
                            items={["trackball", "orbit", "fly"]}
                            text={State.preferences.controlType}
                            onSelect={(it) => {
                                State.preferences.controlType = it;
                                ComponentRef.visualizer.updateVisualizationGraph();
                            }}
                        /> */}
                        <Button
                            minimal={true}
                            icon="code"
                            onClick={() => {
                                window.open(
                                    "https://github.com/grp202004/PiperNet"
                                );
                            }}
                        />
                    </NavbarGroup>
                </BlueprintNavbar>
            );
        }
    }
);
