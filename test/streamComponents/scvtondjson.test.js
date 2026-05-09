import { expect, describe, it, jest } from "@jest/globals";
import CSVToNDJSON from "../../src/streamComponents/csvtondjson.js";

describe("CSV to NDJSON test suit", () => {
  it("give a csv string should return a ndjson string", () => {
    const csvString = `id,name,address\n01,Mehrad,address01\n`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "address"],
    });

    const expected = JSON.stringify({
      id: "01",
      name: "Mehrad",
      address: "address01",
    });

    const fn = jest.fn();
    csvToJSON.on("data", fn);
    csvToJSON.write(csvString);
    csvToJSON.end();

    const [current] = fn.mock.lastCall;
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected));
  });
  it("should work with strings that do not have breakline at the end", () => {
    const csvString = `id,name,address\n01,Mehrad,address01`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "address"],
    });

    const expected = JSON.stringify({
      id: "01",
      name: "Mehrad",
      address: "address01",
    });

    const fn = jest.fn();
    csvToJSON.on("data", fn);
    csvToJSON.write(csvString);
    csvToJSON.end();

    const [current] = fn.mock.lastCall;
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected));
  });
  it(
    "it should work with files that have breaklines in the begining of string",
    () => {
      const csvString = `\nid,name,address\n01,Mehrad,address01\n02,Test,address02`;
      const csvToJSON = new CSVToNDJSON({
        delimiter: ",",
        headers: ["id", "name", "address"],
      });

      const expected = [
        JSON.stringify({
        id: "01",
        name: "Mehrad",
        address: "address01",
      }),
      JSON.stringify({
        id: "02",
        name: "Test",
        address: "address02",
      })
      ]

      const fn = jest.fn();
      csvToJSON.on("data", fn);
      csvToJSON.write(csvString);
      csvToJSON.end();

      const [firstCall] = fn.mock.calls[0];
      const [secondCall] = fn.mock.calls[1];
      expect(JSON.parse(firstCall)).toStrictEqual(JSON.parse(expected[0]));
      expect(JSON.parse(secondCall)).toStrictEqual(JSON.parse(expected[1]));
    },
  );
});
