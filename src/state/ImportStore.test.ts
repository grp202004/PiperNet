import ImportStore from "./ImportStore";
import fs from "fs";
import Graph from "graphology";

const store = new ImportStore();

var hasHeader = [true,false];
var delimiter = ",";
var unsuitableDelimiter = "\t"

const data = fs.readFileSync("src/samples/lesmiserables-edges.csv", "utf-8");
const file = new File([data], "temp.csv", { type: "text/csv" });


test("number of keys", () => {
    store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var numberOfKeys = Object.keys(element).length;
            expect(numberOfKeys).toEqual(3)

        });
    });

})

test("first array element value when it has header", () => {
    store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
        var firstArrayElement = data[0]
        expect(firstArrayElement).toEqual({ "source": "Napoleon", "target": "Myriel", "value": "1" })
    });

})


test("head of array when it has Header", () => {
    store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["source", "target", "value"])
        });
    });
})


test("first array element value when it has not header", () => {
    store.readCSV(file, hasHeader[1], delimiter).then((data: any[]) => {
        var firstArrayElement = data[0]
        expect(firstArrayElement).toEqual(["source", "target", "value"])
    });

})

test("second array element value when it has not header", () => {
    store.readCSV(file, hasHeader[1], delimiter).then((data: any[]) => {
        var firstArrayElement = data[1]
        expect(firstArrayElement).toEqual(["Napoleon", "Myriel", "1"])
    });

})


test("head of array when it has not Header", () => {
    store.readCSV(file, hasHeader[1], delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["0", "1", "2"])

        });
    });
})


test("number of keys use unsuitable delimiter", () => {
    store.readCSV(file, hasHeader[0], unsuitableDelimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var numberOfKeys = Object.keys(element).length;
            expect(numberOfKeys).toEqual(1)
        });
    });
});

test("first array element value when it has header use unsuitable delimiter", () => {
    store.readCSV(file, hasHeader[0], unsuitableDelimiter).then((data: any[]) => {
        var firstArrayElement = data[0]
        expect(firstArrayElement).toEqual({ "source,target,value": "Napoleon,Myriel,1" })
    });

})

test("head of array when it has Header use unsuitable delimiter ", () => {
    store.readCSV(file, hasHeader[0], unsuitableDelimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["source,target,value"])
        });
    });
})

//test about function importGraphFromCSV

// test("import graph", () => {
//     let f = store.readCSV(file, hasHeader[0], delimiter)
//     store.importGraphFromCSV().then((data: { graph: Graph, metadata: { snapshotName: string, nodeProperties: string[], clusterProperties: string | null, edgeProperties: string[] } }) => {
//         console.log(data.metadata.snapshotName)
//     })

// })

//test about function renderImportEdgePreview 

// test("renderImportEdgePreview ", () => {
//     store.readCSV(file, hasHeader[0], delimiter).then((data: any[]) => {
//         store.renderImportEdgePreview()
//         console.log(store.importConfig.edgeFile.topN)
//     });




