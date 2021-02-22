import React from "react";
import { Classes, Dialog } from "@blueprintjs/core";
import { Column, Table, TableLoadingOption } from "@blueprintjs/table";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";

interface Props {
    for: string;
    children: React.ReactNode;
}

export default observer(
    class DataSheetDialogWrapper extends React.Component<Props, {}> {
        state = {
            loading: true,
        };

        renderTable() {
            if (this.state.loading) {
                return (
                    <div className="argo-table-container">
                        <Table
                            className="pt-bordered pt-striped"
                            numRows={20}
                            loadingOptions={[
                                TableLoadingOption.CELLS,
                                TableLoadingOption.COLUMN_HEADERS,
                                TableLoadingOption.ROW_HEADERS,
                            ]}
                        >
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                            <Column />
                        </Table>
                    </div>
                );
            } else {
                return this.props.children;
            }
        }

        render() {
            return (
                <Dialog
                    icon="database"
                    isOpen={
                        this.props.for === "node"
                            ? State.preferences.nodeDataSheetDialogOpen
                            : State.preferences.edgeDataSheetDialogOpen
                    }
                    onOpened={() => {
                        setTimeout(() => {
                            this.setState({
                                loading: false,
                            });
                        }, 100);
                    }}
                    onClose={() => {
                        if (this.props.for === "node") {
                            State.preferences.nodeDataSheetDialogOpen = false;
                        } else {
                            State.preferences.edgeDataSheetDialogOpen = false;
                        }
                        this.setState({
                            loading: true,
                        });
                    }}
                    title="Data Sheet"
                    style={{ minWidth: "80vw" }}
                >
                    <div className={classnames(Classes.DIALOG_BODY)}>
                        {this.renderTable()}
                    </div>
                </Dialog>
            );
        }
    }
);
