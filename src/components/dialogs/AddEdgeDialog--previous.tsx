import React from "react";
import { observer } from "mobx-react";
import { Classes, Dialog, Tag } from "@blueprintjs/core";
// import EdgeAdder from "../utils/EdgeAdder";
import State from "../../state";

export default observer(
    class AddEdgeDialog extends React.Component {
        render() {
            return (
                <Dialog
                    isOpen={State.preferences.AddEdgeDialogOpen}
                    icon="new-object"
                    onClose={() => {
                        State.preferences.AddEdgeDialogOpen = false;
                    }}
                    title="Add Node"
                >
                    <div className={Classes.DIALOG_BODY}>
                        <p>
                            <strong>
                                You can only add edge with two unique node id to the
                                graph dataset.
                            </strong>
                        </p>
                        <p>
                            A <em>UNIQUE</em> edge means there should only exist
                            one edge that connect with two nodes.
                        </p>
                        <Tag>New edges are added to the end of the table</Tag>
                        <hr />
                        {/* <EdgeAdder
                        // onAdded={() => {
                        //     this.setState({ addNodeDialogOpen: false });
                        //     this.forceUpdate();
                        // }}
                        /> */}
                    </div>
                </Dialog>
            );
        }
    }
);
