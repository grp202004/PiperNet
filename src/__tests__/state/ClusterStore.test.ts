import State from "../../state";
import fs from "fs";
const clusterStore = State.cluster;
const importStore = State.import
const csvDataOfLesmiserables = fs.readFileSync(
    "src/samples/lesmiserables/lesmiserables.csv",
    "utf-8"
);

const csvFileOfLesmiserables = new File([csvDataOfLesmiserables], "lesmiserable.csv", { type: "text/csv" });

//test file: lesmiserable.csv
describe('the attribute is undefined', () => {

    describe('test function keyAttribute', () => {
        //1
        test("first key of the keyVauleMap", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let key in clusterStore.keyAttribute.keys()) {
                expect(key).toEqual("Napoleon")
                return;
            }
        })

        //2
        test("first value of the keyVauleMap", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let value in clusterStore.keyAttribute.values()) {
                expect(value).toEqual("undefined")
                return;
            }
        })
    })

    describe('test function getAttributeValues', () => {
        //3
        test("the number of the AttributeValues", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues.length).toEqual(1)
        })

        //4
        test("the first element of the AttributeValues", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues[0]).toEqual("undefined")
        })
    })

    describe('test function attributeKeys', () => {
        //5
        test("the size of the AttributesKeys", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeKeys.size).toEqual(1)
        })

        //6
        test("the key of the AttributeKeys", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let key in clusterStore.attributeKeys.keys()) {
                expect(key).toEqual("undefined")
                return;
            }
        })

        //7
        test("the first array element of the value of the AttributeKeys", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let value in clusterStore.attributeKeys.values()) {
                expect(value[0]).toEqual("Napoleon")
                return;
            }
        })
    })

    describe('test function attributeColor', () => {
        //8
        test("the size of the color map", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeColor.size).toEqual(1)
        })
    })

})

describe('the attribute is defined', () => {
    
    describe('test function keyAttribute', () => {
        //9
        test("first key of the keyVauleMap", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            clusterStore.clusterBy = "id"
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let key in clusterStore.keyAttribute.keys()) {
                expect(key).toEqual("Napoleon")
                return;
            }
        })
        //10
        test("first value of the keyVauleMap", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let value in clusterStore.keyAttribute.values()) {
                expect(value).toEqual("Napoleon")
                return;
            }
        })

    })

    describe('test function getAttributeValues', () => {
        //11
        test("the number of the AttributeValues", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues.length).toEqual(77)
        })

        //12
        test("the first element of the AttributeValues", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues[0]).toEqual("Napoleon")
        })
    })

    describe('test function attributeKeys', () => {
        //13
        test("the size of the AttributesKeys", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeKeys.size).toEqual(77)
        })

        //14
        test("the first key of the AttributeKeys", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let key in clusterStore.attributeKeys.keys()) {
                expect(key).toEqual("Napoleon")
                return;
            }
        })

        //15
        test("the first value of the AttributeKeys", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            for (let value in clusterStore.attributeKeys.values()) {
                expect(value).toEqual(["Napol"])
                return;
            }
        })
    })

    describe('test function attributeColor', () => {
        //16
        test("the size of the color map", async () => {
            importStore.importConfig.edgeFile.mapping.fromId = "source";
            importStore.importConfig.edgeFile.mapping.toId = "target";
            importStore.selectedEdgeFileFromInput = csvFileOfLesmiserables;
            //@ts-ignore
            const data = await importStore.importGraphFromCSV();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeColor.size).toEqual(77)
        })
    })
})
