import React from "react";
import { observer } from "mobx-react";
import { Classes, Dialog, Tag } from "@blueprintjs/core";
import NodeAdder from "../utils/NodeAdder";
import State from "../../state";

export default observer(
    class AddNodeDialog extends React.Component {
        render() {
            return (
                <Dialog
                    isOpen={State.preferences.AddNodeDialogOpen}
                    icon="new-object"
                    onClose={() => {
                        State.preferences.AddNodeDialogOpen = false;
                    }}
                    title="Add Node"
                >
                    <div className={Classes.DIALOG_BODY}>
                        <p>
                            <strong>
                                You can only add node with unique node id to the
                                graph dataset.
                            </strong>
                        </p>
                        <p>
                            A <em>UNIQUE</em> node means there should only exist
                            one node that has the respective node id.
                        </p>
                        <Tag>New nodes are added to the end of the table</Tag>
                        <hr />
                        <NodeAdder
                            onAdded={() => {
                                this.setState({ addNodeDialogOpen: false });
                                this.forceUpdate();
                            }}
                        />
                    </div>
                </Dialog>
            );
        }
    }
);
