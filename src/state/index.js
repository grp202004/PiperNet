import { autorun, runInAction, trace, observable, makeObservable } from "mobx";
import { Intent, Position, Toaster } from "@blueprintjs/core";
import createGraph from "ngraph.graph";

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


// importGraphFromCSV
autorun(() => {
    // Since the CSV lib we use uses int index when there's not header/column names specified
    // but the frontend selector always convert int to string values, we need to
    // manually convert the user-selected fromId and toId values back to int.
    // Note that this should only be done when there's no header provided on the CSV (hasColumns == false).
    const fromIdColumn = State.import.importConfig.edgeFile.columns.findIndex(State.import.importConfig.edgeFile.mapping.fromId);
    const toIdColumn = State.import.importConfig.edgeFile.mapping.fromId;
  
    // Create temporary data structures.
    let nodesArr = [];
    const graph = createGraph();
    const degreeDict = {};
    if (config.hasNodeFile) {
      nodesArr = await readCSV(appState.import.selectedNodeFileFromInput, config.nodes.hasColumns, config.delimiter);
      nodesArr.forEach(node => graph.addNode(node[config.nodes.mapping.id].toString(),
        { id: node[config.nodes.mapping.id].toString(), degree: 0, ...node }));
      nodesArr =
        nodesArr.map(
          n => ({ ...n, id: n[config.nodes.mapping.id].toString(), degree: 0, pagerank: 0 }));
      nodesArr.forEach(n => degreeDict[n.id] = 0);
    }
    const edges = await readCSV(appState.import.selectedEdgeFileFromInput, config.edges.hasColumns, config.delimiter);
    if (config.edges.createMissing) {
      edges.forEach((it) => {
        const from = it[fromId].toString();
        const to = it[toId].toString();
        if (!graph.hasNode(from)) {
          graph.addNode(from, { id: from, degree: 0 });
          nodesArr.push({ id: from, degree: 0, pagerank: 0 });
          degreeDict[from] = 0;
        }
        if (!graph.hasNode(to)) {
          graph.addNode(to, { id: to, degree: 0 });
          nodesArr.push({ id: to, degree: 0, pagerank: 0 });
          degreeDict[to] = 0;
        }
      });
    }
  
    const edgesSet = new Set();
    
    const edgesArr = [];
  
    const addEdge = (from, to) => {
      const edgeKey = `${from}👉${to}`;
      if (edgesSet.has(edgeKey)) {
        return;
      }
      edgesSet.add(edgeKey);
      graph.addLink(from, to);
      degreeDict[from] += 1;
      degreeDict[to] += 1;
      edgesArr.push({
        source_id: from,
        target_id: to,
      });
    };
    
    edges.forEach(it => {
      const from = it[fromId].toString();
      const to = it[toId].toString();
      // Argo currently works with undirected graph
      addEdge(from, to);
      // addEdge(to, from);
    });
  
    const rank = pageRank(graph);
    nodesArr = nodesArr.map(n => ({ ...n, node_id: n.id, pagerank: rank[n.id], degree: degreeDict[n.id] }));
    return {
      rawGraph: { nodes: nodesArr, edges: edgesArr },
      metadata: {
        snapshotName: 'Untitled Graph',
        fullNodes: nodesArr.length,
        fullEdges: edgesArr.length, //Math.floor(edgesArr.length / 2), // Counting undirected edges
        nodeProperties: Object.keys(nodesArr[0]),
        nodeComputed: ['pagerank', 'degree'],
        edgeProperties: ['source_id', 'target_id'],
      },
    }
});

export default State;
