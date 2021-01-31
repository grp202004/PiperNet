import React from "react";
import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import { Column, Table, TableLoadingOption } from "@blueprintjs/table";
import { observer } from "mobx-react";
import classnames from "classnames";
import State from "../../state";
import GraphDataTable from "./GraphDataTable";

export default observer(
    class DataSheetDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                showMoreBy: "pagerank",
                showMoreNum: 5,
            };
        }

        renderTable() {
            if (State.preferences.dataSheetLoading) {
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
                return <GraphDataTable />;
            }
        }

        render() {
            return (
                <Dialog
                    icon="database"
                    isOpen={State.preferences.dataSheetDialogOpen}
                    onOpened={() => {
                        setTimeout(() => {
                            State.preferences.dataSheetLoading = false;
                        }, 100);
                    }}
                    onClose={() => {
                        State.preferences.dataSheetDialogOpen = false;
                        State.preferences.dataSheetLoading = true;
                    }}
                    title="Data Sheet"
                    style={{ minWidth: "80vw" }}
                >
                    <div className={classnames(Classes.DIALOG_BODY)}>
                        {this.renderTable()}
                    </div>

                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button
                                intent={Intent.PRIMARY}
                                onClick={() => {
                                    State.preferences.dataSheetDialogOpen = false;
                                }}
                                text="Done"
                            />
                        </div>
                    </div>
                </Dialog>
            );
        }
    }
);
