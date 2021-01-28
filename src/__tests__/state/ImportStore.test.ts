import ImportStore from "../../state/ImportStore";
import fs from "fs";
import Graph from "graphology";

const store = new ImportStore();

let hasHeader = [true, false];
let delimiter = ",";
let unsuitableDelimiter = "\t";

const data = fs.readFileSync("src/samples/lesmiserables-edges.csv", "utf-8");
const file = new File([data], "temp.csv", { type: "text/csv" });

test("number of keys", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
        data.forEach((element) => {
            let numberOfKeys = Object.keys(element).length;
            expect(numberOfKeys).toEqual(3);
        });
    });
});

test("first array element value when it has header", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
        let firstArrayElement = data[0];
        expect(firstArrayElement).toEqual({
            source: "Napoleon",
            target: "Myriel",
            value: "1",
        });
    });
});

test("head of array when it has Header", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
        data.forEach((element) => {
            let nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["source", "target", "value"]);
        });
    });
});

test("first array element value when it does not have header", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[1], delimiter).then((data: any[]) => {
        let firstArrayElement = data[0];
        expect(firstArrayElement).toEqual(["source", "target", "value"]);
    });
});

test("second array element value when it does not have header", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[1], delimiter).then((data: any[]) => {
        let firstArrayElement = data[1];
        expect(firstArrayElement).toEqual(["Napoleon", "Myriel", "1"]);
    });
});

test("head of array when it does not have header", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[1], delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            let nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["0", "1", "2"]);
        });
    });
});

test("number of keys using unsuitable delimiter", () => {
    store // @ts-ignore
        .readCSV(file, hasHeader[0], unsuitableDelimiter)
        .then((data: any[]) => {
            data.forEach((element) => {
                let numberOfKeys = Object.keys(element).length;
                expect(numberOfKeys).toEqual(1);
            });
        });
});

test("first array element value when it has header use unsuitable delimiter", () => {
    store // @ts-ignore
        .readCSV(file, hasHeader[0], unsuitableDelimiter)
        .then((data: any[]) => {
            let firstArrayElement = data[0];
            expect(firstArrayElement).toEqual({
                "source,target,value": "Napoleon,Myriel,1",
            });
        });
});

test("head of array when it has Header use unsuitable delimiter ", () => {
    store // @ts-ignore
        .readCSV(file, hasHeader[0], unsuitableDelimiter)
        .then((data: any[]) => {
            data.forEach((element) => {
                let nameOfKeys = Object.keys(element);
                expect(nameOfKeys).toEqual(["source,target,value"]);
            });
        });
});

test("renderImportEdgePreview ", () => {
    // @ts-ignore
    store.readCSV(file, hasHeader[0], delimiter).then(async (data: any[]) => {
        await store.renderImportEdgePreview();
        console.log(store.importConfig.edgeFile.topN);
    });
});

test("import graph", async () => {
    store.importConfig.edgeFile.mapping.fromId = "source";
    store.importConfig.edgeFile.mapping.toId = "target";
    store.selectedEdgeFileFromInput = file;
    let data = await store.importGraphFromCSV();
    console.log(data.metadata.snapshotName);
});
