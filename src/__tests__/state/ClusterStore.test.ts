import State from "../../state";
import fs from "fs";
const clusterStore = State.cluster;
const importStore = State.import
const gexfData = fs.readFileSync(
    "src/samples/diseasome.gexf",
    "utf-8"
);


const gexfOfDiseasome = new File([gexfData], "diseasome.gexf", { type: "text/gexf" });

//test file: diseasome.gexf
describe('the attribute is undefined', () => {

    describe('test function keyAttribute', () => {
        //1
        test("first key of the keyVauleMap", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let key of clusterStore.keyAttribute.keys()) {
                expect(key).toEqual("30")
                return;
            }
        })

        //2
        test("first value of the keyVauleMap", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let value of clusterStore.keyAttribute.values()) {
                expect(value).toEqual("undefined")
                return;
            }
        })
    })

    describe('test function getAttributeValues', () => {
        //3
        test("the number of the AttributeValues", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues.length).toEqual(1)
        })

        //4
        test("the first element of the AttributeValues", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues[0]).toEqual("undefined")
        })
    })

    describe('test function attributeKeys', () => {
        //5
        test("the size of the AttributesKeys", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeKeys.size).toEqual(1)
        })

        //6
        test("the key of the AttributeKeys", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let key of clusterStore.attributeKeys.keys()) {
                expect(key).toEqual("undefined")
                return;
            }
        })

        //7
        test("the first array element of the value of the AttributeKeys", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let value of clusterStore.attributeKeys.values()) {
                expect(value[0]).toEqual("30")
                return;
            }
        })
    })

    describe('test function attributeColor', () => {
        //8
        test("the size of the color map", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeColor.size).toEqual(1)
        })
    })

})

describe('the attribute is defined', () => {
    
    describe('test function keyAttribute', () => {
        //9
        test("first key of the keyVauleMap", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            clusterStore.clusterBy = "disclass"
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let key of clusterStore.keyAttribute.keys()) {
                expect(key).toEqual("30")
                return;
            }
        })
        //10
        test("first value of the keyVauleMap", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let value of clusterStore.keyAttribute.values()) {
                expect(value).toEqual("Neurological")
                return;
            }
        })

    })

    describe('test function getAttributeValues', () => {
        //11
        test("the number of the AttributeValues", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues.length).toEqual(23)
        })

        //12
        test("the first element of the AttributeValues", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.getAttributeValues[0]).toEqual("Neurological")
        })
    })

    describe('test function attributeKeys', () => {
        //13
        test("the size of the AttributesKeys", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeKeys.size).toEqual(23)
        })

        //14
        test("the first key of the AttributeKeys", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let key of clusterStore.attributeKeys.keys()) {
                expect(key).toEqual("Neurological")
                return;
            }
        })

        //15
        test("the first value of the AttributeKeys", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            for (let value of clusterStore.attributeKeys.values()) {
                expect(value).toEqual(["30", "36", "81", "120", "157", "158", "166", "185", "188", "210", "211", "212", "213",
                 "217", "219", "220", "307", "364", "367", "368", "369", "370", "374", "375", "376", "390", "420", "442", "527",
                  "602", "616", "640", "689", "751", "752", "753", "754", "766", "767", "779", "829", "852", "911", "928", "929", "935", 
                  "975", "1003", "1015", "1080", "1221", "1270", "1289", "1303", "1304"])
                return;
            }
        })
    })

    describe('test function attributeColor', () => {
        //16
        test("the size of the color map", async () => {
            importStore.selectedGEXFFileFromInput = gexfOfDiseasome;
            //@ts-ignore
            const data = await importStore.importGraphFromGEXF();
            clusterStore.rawGraph = data.graph
            expect(clusterStore.attributeColor.size).toEqual(23)
        })
    })
})

