import React from "react";
import {
    Button,
    ButtonGroup,
    Card,
    Classes,
    Dialog,
    Divider,
    Elevation,
    H3,
    Spinner,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import classnames from "classnames";
import gexf from "graphology-gexf/browser";
import State from "../../state";
import { CSVLink } from "react-csv";

export default observer(
    /**
     * @description Dialog used to export the graph into GEXF file or CSV Node/Edge files
     * @author Chenghao Shi
     * @extends {React.Component}
     */
    class ExportDialog extends React.Component {
        state = {
            ready: true,
        };

        /**
         * compute the GEXF file from rawGraph
         * delete the temporary _visualize attribute from the graph
         *
         * @returns {*}
         */
        computeGEXFFile() {
            let graphCopy = State.graph.rawGraph.copy();
            graphCopy.forEachNode((_node, attributes: any) => {
                delete attributes["_visualize"];
            });
            graphCopy.forEachEdge((_edge, attributes: any) => {
                delete attributes["_visualize"];
            });
            return gexf.write(graphCopy);
        }

        computeNodeFile() {
            let headers: {
                label: string;
                key: string;
            }[] = [];
            headers.push({ label: "_id", key: "_id" });
            State.graph.metadata.nodeProperties.map((value) => {
                headers.push({ label: value, key: value });
                return null;
            });

            let exportData = State.graph.rawGraph.export();
            let data: any[] = [];
            exportData.nodes.forEach((node) => {
                data.push({
                    _id: node.key,
                    ...node.attributes,
                });
            });
            return { headers: headers, data: data };
        }

        computeEdgeFile() {
            let headers: {
                label: string;
                key: string;
            }[] = [
                { label: "source", key: "source" },
                { label: "target", key: "target" },
            ];

            let exportData = State.graph.rawGraph.export();
            let data: any[] = [];
            exportData.edges.forEach((edge) => {
                data.push({
                    source: edge.source,
                    target: edge.target,
                });
            });
            return { headers: headers, data: data };
        }

        render() {
            return (
                <Dialog
                    icon="projects"
                    isOpen={State.preferences.exportDialogOpen}
                    onClose={() => {
                        State.preferences.exportDialogOpen = false;
                    }}
                    title={`Export Graph`}
                >
                    {!this.state.ready ? (
                        <Spinner />
                    ) : (
                        <div className={classnames(Classes.DIALOG_BODY)}>
                            <Card interactive={false} elevation={Elevation.ONE}>
                                <H3>
                                    GEXF Export{" "}
                                    <Button
                                        icon="help"
                                        minimal={true}
                                        onClick={() => {
                                            window.open(
                                                "https://gephi.org/gexf/format/"
                                            );
                                        }}
                                    />
                                </H3>
                                <Divider />

                                <CSVLink
                                    data={this.computeGEXFFile()}
                                    filename={"Snapshot-GEXF.gexf"}
                                    className="btn btn-primary"
                                    target="_blank"
                                >
                                    <Button>Download GEXF File</Button>
                                </CSVLink>
                            </Card>
                            <br />
                            <Card interactive={false} elevation={Elevation.ONE}>
                                <H3>
                                    CSV Export{" "}
                                    <Button
                                        icon="help"
                                        minimal={true}
                                        onClick={() => {
                                            window.open(
                                                "https://github.com/grp202004/PiperNet#data-import"
                                            );
                                        }}
                                    />
                                </H3>

                                <Divider />
                                <ButtonGroup>
                                    <CSVLink
                                        data={this.computeNodeFile().data}
                                        headers={this.computeNodeFile().headers}
                                        separator={","}
                                        filename={"Snapshot-Node.csv"}
                                        className="btn btn-primary"
                                        target="_blank"
                                    >
                                        <Button>Download Node File</Button>
                                    </CSVLink>
                                    <Divider />
                                    <CSVLink
                                        data={this.computeEdgeFile().data}
                                        headers={this.computeEdgeFile().headers}
                                        separator={","}
                                        filename={"Snapshot-Edge.csv"}
                                        className="btn btn-primary"
                                        target="_blank"
                                    >
                                        <Button>Download Edge File</Button>
                                    </CSVLink>
                                </ButtonGroup>
                            </Card>
                        </div>
                    )}
                </Dialog>
            );
        }
    }
);
