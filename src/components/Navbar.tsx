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
import ClusterChooser, { HierarchyLevelChooser } from "./utils/ClusterChooser";
import logo from "../images/icon.png";
import State from "../state";
import { Popover2 } from "@blueprintjs/popover2";
import SearchPanel from "./panels/SearchPanel";
import * as THREE from "three";
import { ARROW_RIGHT } from "@blueprintjs/core/lib/esm/common/keys";
import { random } from "lodash";
import { color } from "d3-color";


export default observer(
    /**
     * @description the navigation bar on the top
     * @author Zichen XU
     * @class Navbar
     * @extends {React.Component}
     */
    class Navbar extends React.Component {
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
                                        text="Load Cluster"
                                        icon="import"
                                        onClick={()=>{
                                            if(State.graphDelegate.clusterObject.fusionClusterObjects){
                                                State.graphDelegate.clusterObject.initEmptyMapAndFusion();
                                            }
                                            State.import.clusterMap?.forEach((value,key)=>{
                                                // State.import.UUID2PointsMap = new Map<string, string[]>();
                                                let sphere : THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial> = new THREE.Mesh(State.graphDelegate.clusterObject.convexHullObject2(value), new THREE.MeshBasicMaterial);
                                                //@ts-ignore
                                                sphere["_color"] = State.import.colorMap?.get(key.depth) as string;
                                                State.graphDelegate.clusterObject.meshNormalMaterial(sphere);
                                                // State.import.UUID2PointsMap.set(sphere.uuid, value);
                                                State.graphDelegate.clusterObject.fusionClusterObjects?.add(sphere);
                                            });
                                        }}
                                    >
                                    </MenuItem>
                                    <MenuItem
                                        text="Load sample"
                                        icon="import"
                                        onClick={()=>{
                                            State.clusterInteraction.hierarchicalMergeCluster(["AA","AB"]);
                                        }}
                                        >
                                    </MenuItem>
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
                        <HierarchyLevelChooser
                        onSelect ={(show:string|null)=>{
                            State.cluster.showlevel = show;

                            if(State.graphDelegate.clusterObject.fusionClusterObjects){
                                State.graphDelegate.clusterObject.initEmptyMapAndFusion();
                            }
                            State.import.clusterMap?.forEach((value,key)=>{
                                // State.import.UUID2PointsMap = new Map<string, string[]>();
                                if(key.depth.toString() === show){
                                    let sphere : THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial> = new THREE.Mesh(State.graphDelegate.clusterObject.convexHullObject2(value), new THREE.MeshBasicMaterial);
                                    //@ts-ignore
                                    sphere["_color"] = State.import.colorMap?.get(key.depth) as string;
                                    State.graphDelegate.clusterObject.meshNormalMaterial(sphere);
                                    // State.import.UUID2PointsMap.set(sphere.uuid, value);
                                    State.graphDelegate.clusterObject.fusionClusterObjects?.add(sphere);
                                }
                                
                            });
                            
                        }}
                        syncWith = {State.cluster.showlevel}
                    />
                        <NavbarDivider/>
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
