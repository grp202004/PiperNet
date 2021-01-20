import ImportStore from "./ImportStore";
import fs from "fs";

const store = new ImportStore();
const storePrototype = Object.getPrototypeOf(store);

const headTest = false;

const delimiter = ",";

try {
    let data = fs.readFileSync("src/samples/lesmiserables-edges.csv", "utf-8");
    console.log(data.length, "File read into test");
    test("isReturningPromise", () => {
        // using private method
        expect(
            storePrototype.readCSV(data, headTest, delimiter)
        ).toBeInstanceOf(Promise);
    });
} catch (err) {
    console.log(err);
}
