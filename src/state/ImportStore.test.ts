import ImportStore from "./ImportStore";
import fs from "fs";

const store = new ImportStore();

var hasHeader = true;
var delimiter = ",";

const data = fs.readFileSync("src/samples/lesmiserables-edges.csv", "utf-8");
const file = new File([data], "temp.csv", { type: "text/csv" });

test("number of keys", () => {
    store.readCSV(file, hasHeader, delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var numberOfKeys = Object.keys(element).length;
            expect(numberOfKeys).toEqual(3)

        });
    });

})

test("first array element value when it has header", () => {
    store.readCSV(file, hasHeader, delimiter).then((data: any[]) => {
        var firstArrayElement = data[0]
        expect(firstArrayElement).toEqual({ "source": "Napoleon", "target": "Myriel", "value": "1" })
    });

})


test("head of array when it has Header", () => {
    store.readCSV(file, hasHeader, delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["source", "target", "value"])
        });
    });
})

var hasNoHeader = false

test("first array element value when it has header", () => {
    store.readCSV(file, hasNoHeader, delimiter).then((data: any[]) => {
        var firstArrayElement = data[0]
        expect(firstArrayElement).toEqual(["source", "target", "value"])
    });

})

test("second array element value when it has not header", () => {
    store.readCSV(file, hasNoHeader, delimiter).then((data: any[]) => {
        var firstArrayElement = data[1]
        expect(firstArrayElement).toEqual(["Napoleon", "Myriel", "1"])
    });

})


test("head of array when it has not Header", () => {
    store.readCSV(file, hasNoHeader, delimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["0", "1", "2"])

        });
    });
})


var unsuitableDelimiter = "\t"

test("number of keys use unsuitable delimiter", () => {
    store.readCSV(file, hasHeader, unsuitableDelimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var numberOfKeys = Object.keys(element).length;
            expect(numberOfKeys).toEqual(1)
        });
    });
});

test("first array element value when it has header use unsuitable delimiter", () => {
    store.readCSV(file, hasHeader, unsuitableDelimiter).then((data: any[]) => {
        var firstArrayElement = data[0]
        expect(firstArrayElement).toEqual({ "source,target,value": "Napoleon,Myriel,1" })
    });

})

test("head of array when it has Header use unsuitable delimiter ", () => {
    store.readCSV(file, hasHeader, unsuitableDelimiter).then((data: any[]) => {
        data.forEach(function (element) {
            var nameOfKeys = Object.keys(element);
            expect(nameOfKeys).toEqual(["source,target,value"])
        });
    });
})


test("import graph", () => {
    store.readCSV(file, hasHeader, delimiter)

})
