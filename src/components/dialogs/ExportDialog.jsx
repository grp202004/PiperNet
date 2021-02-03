import React from "react";
import {
    Button,
    Classes,
    Card,
    Icon,
    Dialog,
    Intent,
    Spinner,
    Elevation,
    Divider,
    H3,
    ButtonGroup,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import { makeObservable, computed } from "mobx";
import classnames from "classnames";
import gexf from "graphology-gexf/browser";
import State from "../../state";
import { CSVLink } from "react-csv";

export default observer(
    class ExportDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                ready: true,
            };
        }

        computeGEXFFile() {
            return gexf.write(State.graph.rawGraph);
        }

        computeNodeFile() {
            let headers = [];
            State.graph.metadata.nodeProperties.map((value) => {
                headers.push({ label: value, key: value });
            });
            headers.push({ label: "_id", key: "_id" });
            let exportData = State.graph.rawGraph.export();
            let data = [];
            exportData.nodes.forEach((node) => {
                data.push({
                    _id: node.key,
                    ...node.attributes,
                });
            });
            return { headers: headers, data: data };
        }

        computeEdgeFile() {
            let headers = [
                { label: "source", key: "source" },
                { label: "target", key: "target" },
            ];

            let exportData = State.graph.rawGraph.export();
            let data = [];
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
                    isOpen={State.project.exportDialogOpen}
                    onClose={() => {
                        State.project.exportDialogOpen = false;
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
                            <br></br>
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
                                        header={this.computeNodeFile().header}
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
                                        header={this.computeEdgeFile().header}
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
