/**
* Test functions in ImportStore.ts
* @author Tianyi Zhang
*/
import ImportStore from "../../state/ImportStore";
import fs from "fs";

const store = new ImportStore();

let hasHeader = [true, false];
let delimiter = ",";
let unsuitableDelimiter = "\t";

const csvDataOfLesmiserables = fs.readFileSync(
    "src/samples/lesmiserables/lesmiserables.csv",
    "utf-8"
);

const csvDataOfDh11Edge = fs.readFileSync(
    "src/samples/dh11/dh11_edges.csv",
    "utf-8"
);

const csvDataOfDh11Node = fs.readFileSync(
    "src/samples/dh11/dh11_nodes.csv",
    "utf-8"
);

const gexfDataOfLesmiserables = fs.readFileSync(
    "src/samples/lesmiserables/lesmiserables.gexf",
    "utf-8"
);

const gexfDataOfDiseasome = fs.readFileSync(
    "src/samples/diseasome.gexf",
    "utf-8"
);

const csvFileOfLesmiserables = new File(
    [csvDataOfLesmiserables],
    "lesmiserable.csv",
    { type: "text/csv" }
);

const csvFileOfDh11Edge = new File([csvDataOfDh11Edge], "dh11_edges.csv", {
    type: "text/csv",
});

const csvFileOfDh11Node = new File([csvDataOfDh11Node], "dh11_nodes.csv", {
    type: "text/csv",
});

const gexfFileOfLesmiserables = new File([gexfDataOfLesmiserables], "lesmiserable.gexf", {
    type: "text/gexf",
});

const gexfFileOfDiseasome = new File([gexfDataOfDiseasome], "diseasome.gexf", {
    type: "text/gexf",
});


describe("the outer", () => {
    beforeEach(() => {
        store.importConfig = {
            hasNodeFile: false,
            nodeFile: {
                // the file is successfully parsed and ready for display
                isReady: false,
                parseError: false,
                path: "",

                // has header at the top
                hasHeader: true,

                topN: [],
                //names for the columns of this csv
                columns: [],
                mapping: {
                    id: "Unknown",
                },
                delimiter: ",",
            },
            edgeFile: {
                isReady: false,
                parseError: false,

                // should save the csv to temp for further change the cluster attribute
                path: "",
                hasHeader: true,

                // array of objects storing the
                topN: [],
                columns: [],
                mapping: {
                    fromId: "Unknown",
                    toId: "Unknown",
                },
                delimiter: ",",
            },
        };
    });

    describe("test function readCSV", () => {
        //Test file: src/samples/lesmiserables/lesmiserables.csv
        //1
        test("number of keys", async () => {
            // @ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[0],
                delimiter
            );
            data.forEach(function (element) {
                let numberOfKeys = Object.keys(element).length;
                expect(numberOfKeys).toEqual(3);
            });
        });

        //2
        test("first array element value when it has header", async () => {
            // @ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[0],
                delimiter
            );
            let firstArrayElement = data[0];
            expect(firstArrayElement).toEqual({
                source: "Napoleon",
                target: "Myriel",
                value: "1",
            });
        });

        //3
        test("head of array when it has Header", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[0],
                delimiter
            );
            data.forEach(function (element) {
                let nameOfKeys = Object.keys(element);
                expect(nameOfKeys).toEqual(["source", "target", "value"]);
            });
        });

        //4
        test("first array element value when it has not header", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[1],
                delimiter
            );
            let firstArrayElement = data[0];
            expect(firstArrayElement).toEqual(["source", "target", "value"]);
        });

        //5
        test("second array element value when it has not header", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[1],
                delimiter
            );
            let firstArrayElement = data[1];
            expect(firstArrayElement).toEqual(["Napoleon", "Myriel", "1"]);
        });

        //6
        test("head of array when it has not Header", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[1],
                delimiter
            );
            data.forEach(function (element) {
                let nameOfKeys = Object.keys(element);
                expect(nameOfKeys).toEqual(["0", "1", "2"]);
            });
        });

        //7
        test("number of keys use unsuitable delimiter", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[0],
                unsuitableDelimiter
            );
            data.forEach(function (element) {
                let numberOfKeys = Object.keys(element).length;
                expect(numberOfKeys).toEqual(1);
            });
        });

        //8
        test("first array element value when it has header use unsuitable delimiter", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[0],
                unsuitableDelimiter
            );
            let firstArrayElement = data[0];
            expect(firstArrayElement).toEqual({
                "source,target,value": "Napoleon,Myriel,1",
            });
        });

        //9
        test("head of array when it has Header use unsuitable delimiter ", async () => {
            //@ts-ignore
            const data = await store.readCSV(
                csvFileOfLesmiserables,
                hasHeader[0],
                unsuitableDelimiter
            );
            data.forEach(function (element) {
                let nameOfKeys = Object.keys(element);
                expect(nameOfKeys).toEqual(["source,target,value"]);
            });
        });
    });

    describe("test function renderImportEdgePreview", () => {
        //Test file: src/samples/dh11/dh11_edges.csv
        //10
        test("store.importConfig.edgeFile.columns after renderImportEdgePreview ", async () => {
            // @ts-ignore
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportEdgePreview();
            expect(store.importConfig.edgeFile.columns).toEqual([
                "Source",
                "Target",
                "Type",
                "Id",
                "Label",
                "Weight",
            ]);
        });

        //11
        test("the length of store.importConfig.edgeFile.topN after renderImportEdgePreview ", async () => {
            // @ts-ignore
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportEdgePreview();
            expect(store.importConfig.edgeFile.topN.length).toEqual(9);
        });

        //12
        test("the first element of store.importConfig.edgeFile.topN after renderImportEdgePreview ", async () => {
            // @ts-ignore
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportEdgePreview();
            expect(store.importConfig.edgeFile.topN[0]).toEqual({
                Source: "1",
                Target: "353",
                Type: "Directed",
                Id: "1",
                Label: "",
                Weight: "1.0",
            });
        });

        //13
        test("store.importConfig.edgeFile.isReady after renderImportEdgePreview ", async () => {
            // @ts-ignore
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportEdgePreview();
            expect(store.importConfig.edgeFile.isReady).toBeTruthy();
        });

        //14
        test("store.importConfig.edgeFile.mapping.fromId after renderImportEdgePreview", async () => {
            // @ts-ignore
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportEdgePreview();
            expect(store.importConfig.edgeFile.mapping.fromId).toEqual(
                "Source"
            );
        });

        //15
        test("store.importConfig.edgeFile.mapping.toId after renderImportEdgePreview", async () => {
            // @ts-ignore
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportEdgePreview();
            expect(store.importConfig.edgeFile.mapping.toId).toEqual("Target");
        });
    });

    describe("test function renderImportNodePreview", () => {
        //16
        //Test file: src/samples/dh11/dh11_nodes.csv
        test("store.importConfig.nodeFile.columns after renderImportNodePreview ", async () => {
            // @ts-ignore
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            await store.renderImportNodePreview();
            expect(store.importConfig.nodeFile.columns).toEqual([
                "Id",
                "Label",
                "type",
                "xcoord",
                "ycoord",
                "category",
                "Modularity Class",
                "Eigenvector Centrality",
                "In Degree",
                "Out Degree",
                "Degree",
                "Weighted Degree",
            ]);
        });

        //17
        test("the length of store.importConfig.nodeFile.topN after renderImportNodePreview ", async () => {
            // @ts-ignore
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            await store.renderImportNodePreview();
            expect(store.importConfig.nodeFile.topN.length).toEqual(9);
        });

        //18
        test("the first element of store.importConfig.nodeFile.topN after renderImportNodePreview ", async () => {
            // @ts-ignore
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            await store.renderImportNodePreview();
            expect(store.importConfig.nodeFile.topN[0]).toEqual({
                Degree: "2",
                "Eigenvector Centrality": "0.1708217782071894",
                Id: "1",
                "In Degree": "0",
                Label: "Robert C. Allen",
                "Modularity Class": "0",
                "Out Degree": "2",
                "Weighted Degree": "2",
                category: "individual",
                type: "person",
                xcoord: "0.0",
                ycoord: "0.0",
            });
        });

        //19
        test("store.importConfig.nodeFile.isReady after renderImportNodePreview ", async () => {
            // @ts-ignore
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            await store.renderImportNodePreview();
            expect(store.importConfig.nodeFile.isReady).toBeTruthy();
        });

        //20
        test("store.importConfig.nodeFile.mapping.Id after renderImportNodePreview", async () => {
            // @ts-ignore
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            await store.renderImportNodePreview();
            expect(store.importConfig.nodeFile.mapping.id).toEqual("Id");
        });
    });

    describe("test function importGraphFromCSV with only edge file", () => {
        //Test file: src/samples/dh11/dh11_edges.csv

        //21
        test("the nodeProperties of the graph", async () => {
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            const data = await store.importGraphFromCSV();
            expect(data.metadata.nodeProperties).toEqual(["id"]);
        });

        //22
        test("the number of nodes of the graph", async () => {
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            const data = await store.importGraphFromCSV();
            expect(data.graph.order).toEqual(621);
        });

        //23
        test("the number of edges of the graph", async () => {
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            const data = await store.importGraphFromCSV();
            expect(data.graph.size).toEqual(733);
        });

        //24
        test("the attribute importConfig.edgeFile.isReady", async () => {
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.importGraphFromCSV();
            expect(store.importConfig.edgeFile.isReady).toBeTruthy();
        });

        //25
        test("every element of edges of the graph", async () => {
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            const data = await store.importGraphFromCSV();
            data.graph.forEachEdge((node, attributes) => {
                expect(attributes).toEqual({});
            });
        });
    });

    describe("test function importGraphFromCSV with both nodes and edges file", () => {
        //Test file: src/samples/dh11/dh11_edges.csv and src/samples/dh11/dh_11nodes.csv

        //26
        test("the nodeProperties of the graph", async () => {
            store.importConfig.hasNodeFile = true;
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportNodePreview();
            const data = await store.importGraphFromCSV();
            expect(data.metadata.nodeProperties).toEqual([
                "Label",
                "type",
                "xcoord",
                "ycoord",
                "category",
                "Modularity Class",
                "Eigenvector Centrality",
                "In Degree",
                "Out Degree",
                "Degree",
                "Weighted Degree",
            ]);
        });

        //27
        test("the number of nodes of the graph", async () => {
            store.importConfig.hasNodeFile = true;
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportNodePreview();
            const data = await store.importGraphFromCSV();
            expect(data.graph.order).toEqual(621);
        });

        //28
        test("the number of edges of the graph", async () => {
            store.importConfig.hasNodeFile = true;
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportNodePreview();
            const data = await store.importGraphFromCSV();
            expect(data.graph.size).toEqual(733);
        });

        //29
        test("first element of nodes of the graph", async () => {
            store.importConfig.hasNodeFile = true;
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportNodePreview();
            const data = await store.importGraphFromCSV();
            data.graph.forEachNodeUntil((node, attributes) => {
                expect(attributes).toEqual({
                    Degree: "2",
                    "Eigenvector Centrality": "0.1708217782071894",
                    "In Degree": "0",
                    Label: "Robert C. Allen",
                    "Modularity Class": "0",
                    "Out Degree": "2",
                    "Weighted Degree": "2",
                    category: "individual",
                    type: "person",
                    xcoord: "0.0",
                    ycoord: "0.0",
                });
                if (node == "1") {
                    return true;
                }
            });
        });

        //30
        test("every element of edges of the graph", async () => {
            store.importConfig.hasNodeFile = true;
            store.importConfig.edgeFile.mapping.fromId = "Source";
            store.importConfig.edgeFile.mapping.toId = "Target";
            store.selectedNodeFileFromInput = csvFileOfDh11Node;
            store.selectedEdgeFileFromInput = csvFileOfDh11Edge;
            await store.renderImportNodePreview();
            const data = await store.importGraphFromCSV();
            data.graph.forEachEdge((node, attributes) => {
                expect(attributes).toEqual({});
            });
        });
    });

    describe("test function readGEXF", () => {
        //Test file: src/samples/lesmiserables/lesmiserables.gexf
        //31
        test("number of nodes", async () => {
            store.selectedGEXFFileFromInput = gexfFileOfLesmiserables;
            // @ts-ignore
            const data = await store.readGEXF();
            expect(data.order).toEqual(77);
        });
        //32
        test("first element of nodes", async () => {
            store.selectedGEXFFileFromInput = gexfFileOfLesmiserables;
            // @ts-ignore
            const data = await store.readGEXF();
            data.forEachNodeUntil((node, attributes) => {
                expect(attributes).toEqual({
                    label: "Myriel",
                    size: 10,
                    x: -401.87656,
                    y: 341.06934,
                });
                if (node == "0") {
                    return true;
                }
            });
        });
        //33
        test("number of edges", async () => {
            store.selectedGEXFFileFromInput = gexfFileOfLesmiserables;
            // @ts-ignore
            const data = await store.readGEXF();
            expect(data.size).toEqual(254);
        });
        //34
        test("first element of edges", async () => {
            store.selectedGEXFFileFromInput = gexfFileOfLesmiserables;
            // @ts-ignore
            const data = await store.readGEXF();
            data.forEachEdgeUntil((node, attributes) => {
                expect(attributes).toEqual({});
                if (node == "0") {
                    return true;
                }
            });
        });
    });

    describe("test function importGraphFromGEXF", () => {
        //Test file: src/samples/diseasome.gexf
        //35
        test("the nodeProperties of the graph", async () => {
            store.selectedEdgeFileFromInput = gexfFileOfDiseasome;
            const data = await store.importGraphFromGEXF();
            expect(data.metadata.nodeProperties).toEqual(["label", "size", "x", "y"]);
        });

        //36
        test("the number of nodes of the graph", async () => {
            store.selectedEdgeFileFromInput = gexfFileOfDiseasome;
            const data = await store.importGraphFromGEXF();
            expect(data.graph.order).toEqual(77);
        });

        //37
        test("the number of edges of the graph", async () => {
            store.selectedEdgeFileFromInput = gexfFileOfDiseasome;
            const data = await store.importGraphFromGEXF();
            expect(data.graph.size).toEqual(254);
        });
    })
    
});
