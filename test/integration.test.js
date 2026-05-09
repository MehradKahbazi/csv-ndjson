import { expect, describe, it, jest, afterAll } from "@jest/globals";
import { pipeline } from "node:stream/promises";
import CSVToNDJSON from "../src/streamComponents/csvtondjson.js";
import { Readable, Writable } from "node:stream";
import Reporter from "../src/streamComponents/reporter.js";

describe("CSV to NDJSON", () => {
  const reporter = new Reporter();
  it("given a CSV string it should parse each line to a valid NDJSON string", async () => {
    const csvString = `id,name,address\n01,Mehrad,address01\n02,Test,address02`;
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "address"],
    });
    const spy = jest.fn();
    await pipeline(
      Readable.from(csvString),
      csvToJSON,
      reporter.progress(csvString.length),
      Writable({
        write(chunk, enc, cd) {
          spy(chunk);
          cd(null, chunk);
        },
      }),
    );

    const times = csvString.split("\n").length - 1;
    expect(spy).toHaveBeenCalledTimes(times);

    const [firstCall, secondCall] = spy.mock.calls;
    expect(JSON.parse(firstCall)).toStrictEqual({
      id: "01",
      name: "Mehrad",
      address: "address01",
    });

    expect(JSON.parse(secondCall)).toStrictEqual({
      id: "02",
      name: "Test",
      address: "address02",
    });
  });
});
