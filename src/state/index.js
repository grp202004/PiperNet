import { autorun, runInAction, trace, observable, makeObservable } from "mobx";
import { Intent, Position, Toaster } from "@blueprintjs/core";

import parse from "csv-parse/lib/sync";

import PreferencesStore from "./PreferencesStore";
import GraphStore from "./GraphStore";
import ImportStore from "./ImportStore";
import ProjectStore from "./ProjectStore";
import SearchStore from "./SearchStore";

class AppState {
    constructor() {
        this.preferences = new PreferencesStore();
        this.graph = new GraphStore();
        this.import = new ImportStore();
        this.search = new SearchStore();
        this.project = new ProjectStore();
    }
}

const State = new AppState();
window.state = State;

// extract CSV from selected edge File object and update related fields.
// will auto run if selectedEdgeFileFromInput or delimiter or anything is changed.
autorun(() => {
    trace();
    let file = State.import.selectedEdgeFileFromInput;
    let edgeFileConfig = State.import.importConfig.edgeFile;
    let hasHeader = edgeFileConfig.hasHeader;
    let delimiter = edgeFileConfig.delimiter;

    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
        // Read entire CSV into memory as string
        const fileAsString = reader.result;

        // Get top 20 lines. Or if there's less than 10 line, get all the lines.
        const lines = fileAsString.split("\n");
        const lineNumber = lines.length;
        let topLinesAsString = lines
            .map((l) => l.trim())
            // l is the value and i is the index value
            .filter((l, i) => i < 20)
            .join("\n");
        console.log(topLinesAsString);

        // Parse the top lines
        try {
            const it = hasHeader
                ? parse(topLinesAsString, {
                      comment: "#",
                      trim: true,
                      auto_parse: true,
                      skip_empty_lines: true,
                      columns: hasHeader,
                      delimiter: delimiter,
                  })
                : parse(topLinesAsString, {
                      comment: "#",
                      trim: true,
                      auto_parse: true,
                      skip_empty_lines: true,
                      columns: undefined,
                      delimiter: delimiter,
                  });
            edgeFileConfig.topN = it;
            edgeFileConfig.columns = Object.keys(it[0]).map((key) => `${key}`);

            // if there exists two or more columns in the parsed edge file
            if (edgeFileConfig.columns.length >= 2) {
                edgeFileConfig.mapping.fromId = edgeFileConfig.columns[0];
                edgeFileConfig.mapping.toId = edgeFileConfig.columns[1];
                edgeFileConfig.isReady = true;
            } else if (edgeFileConfig.columns.length == 1) {
                edgeFileConfig.mapping.fromId = edgeFileConfig.mapping.toId =
                    edgeFileConfig.columns[0];
                edgeFileConfig.isReady = true;
            } else {
                Toaster.create({
                    position: Position.TOP,
                }).show({
                    message: "Error: Fails to parse file",
                    intent: Intent.DANGER,
                    timeout: -1,
                });
            }
        } catch {
            Toaster.create({
                position: Position.TOP,
            }).show({
                action: {
                    onClick: () => window.location.reload(),
                    text: "Refresh Page",
                },
                message: "Error: Fails to parse file",
                intent: Intent.DANGER,
                timeout: -1,
            });
        }
    };

    reader.onerror = () => {
        console.error(reader.error);
        Toaster.create({
            position: Position.TOP,
        }).show({
            action: {
                onClick: () => window.location.reload(),
                text: "Refresh Page",
            },
            message: "Error: Fails to open file",
            intent: Intent.DANGER,
            timeout: -1,
        });
    };
});

// extract CSV from selected node File object and update related fields.
// will auto run if selectedNodeFileFromInput or delimiter or anything is changed.
autorun(() => {
    let file = State.import.selectedNodeFileFromInput;
    let nodeFileConfig = State.import.importConfig.nodeFile;
    let hasHeader = nodeFileConfig.hasHeader;
    let delimiter = nodeFileConfig.delimiter;

    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
        // Read entire CSV into memory as string
        const fileAsString = reader.result;
        // Get top 20 lines. Or if there's less than 10 line, get all the lines.
        const lines = fileAsString.split("\n");
        const lineNumber = lines.length;
        const topLinesAsString = lines
            .map((l) => l.trim())
            .filter((l, i) => i < 20)
            .join("\n");
        console.log(topLinesAsString);

        // Parse the top lines
        try {
            const it = hasHeader
                ? parse(topLinesAsString, {
                      comment: "#",
                      trim: true,
                      auto_parse: true,
                      skip_empty_lines: true,
                      columns: hasHeader,
                      delimiter,
                  })
                : parse(topLinesAsString, {
                      comment: "#",
                      trim: true,
                      auto_parse: true,
                      skip_empty_lines: true,
                      columns: undefined,
                      delimiter,
                  });
            nodeFileConfig.topN = it;
            nodeFileConfig.columns = Object.keys(it[0]).map((key) => `${key}`);

            // if there exists two or more columns in the parsed edge file
            if (nodeFileConfig.columns.length >= 2) {
                nodeFileConfig.mapping.id = nodeFileConfig.columns[0];
                nodeFileConfig.mapping.cluster = nodeFileConfig.columns[1];
                nodeFileConfig.isReady = true;
            } else if (nodeFileConfig.columns.length == 1) {
                nodeFileConfig.mapping.id = nodeFileConfig.mapping.cluster =
                    nodeFileConfig.columns[0];
                nodeFileConfig.isReady = true;
            } else {
                Toaster.create({
                    position: Position.TOP,
                }).show({
                    action: {
                        onClick: () => window.location.reload(),
                        text: "Refresh Page",
                    },
                    message: "Error: Fails to parse file",
                    intent: Intent.DANGER,
                    timeout: -1,
                });
            }
        } catch {
            Toaster.create({
                position: Position.TOP,
            }).show({
                action: {
                    onClick: () => window.location.reload(),
                    text: "Refresh Page",
                },
                message: "Error: Fails to parse file",
                intent: Intent.DANGER,
                timeout: -1,
            });
        }
    };

    reader.onerror = () => {
        console.error(reader.error);
        Toaster.create({
            position: Position.TOP,
        }).show({
            action: {
                onClick: () => Location.reload(),
                text: "Refresh Page",
            },
            message: "Error: Fails to open file",
            intent: Intent.DANGER,
            timeout: -1,
        });
    };
});

export default State;
