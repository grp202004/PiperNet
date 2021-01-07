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
    let hasHeader = State.import.importConfig.edgeFile.hasHeader;
    let delimiter = State.import.importConfig.edgeFile.delimiter;

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
            State.import.importConfig.edgeFile.topN = it;
            State.import.importConfig.edgeFile.columns = Object.keys(it[0]).map(
                (key) => `${key}`
            );
            State.import.importConfig.edgeFile.mapping.fromId =
                State.import.importConfig.edgeFile.columns[0];
            State.import.importConfig.edgeFile.mapping.toId =
                State.import.importConfig.edgeFile.columns[1];
            State.import.importConfig.edgeFile.isReady = true;
        } catch {
            Toaster.create({
                position: Position.TOP,
            }).show({
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
            message: "Error: Fails to open file",
            intent: Intent.DANGER,
            timeout: -1,
        });
    };
});

// extract CSV from selected node File object and update related fields.
// will auto run if selectedNodeFileFromInput or delimiter or anything is changed.
autorun(() => {
    const file = State.import.selectedNodeFileFromInput;
    const hasHeader = State.import.importConfig.nodeFile.hasHeader;
    const delimiter = State.import.importConfig.nodeFile.delimiter;

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
            State.import.importConfig.nodeFile.topN = it;
            State.import.importConfig.nodeFile.columns = Object.keys(it[0]).map(
                (key) => `${key}`
            );
            State.import.importConfig.nodeFile.mapping.id =
                State.import.importConfig.nodeFile.columns[0];
            State.import.importConfig.nodeFile.mapping.cluster =
                State.import.importConfig.nodeFile.columns[1];
            State.import.importConfig.nodeFile.isReady = true;
        } catch {
            Toaster.create({
                position: Position.TOP,
            }).show({
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
            message: "Error: Fails to open file",
            intent: Intent.DANGER,
            timeout: -1,
        });
    };
});

export default State;
