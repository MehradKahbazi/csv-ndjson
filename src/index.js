import { Transform } from "node:stream";
import CSVToNDJSON from "./streamComponents/csvtondjson.js";
import Reporter from "./streamComponents/reporter.js";
import { log } from "./util.js";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";

const reporter = new Reporter();
const filename = "big.csv";
const { size: fileSize } = statSync(filename);

let counter = 0;
const processData = Transform({
  transform(chunk, enc, callback) {
    const data = JSON.parse(chunk);
    
    const result = JSON.stringify({
      ...data,
      id: counter++,
    }).concat("\n");
    return callback(null, result);
  },
});

const csvToJSON = new CSVToNDJSON({
  delimiter: ",",
  headers: ["id", "name", "desc", "age"],
});

const startedAt = Date.now();
await pipeline(
  createReadStream(filename),
  csvToJSON,
  processData,
  reporter.progress(fileSize),
  createWriteStream("big.ndjson"),
);

const timeInSeconds = Math.round(Date.now() - startedAt / 1000).toFixed(2);

const finalTime =
  timeInSeconds > 60 ? `${timeInSeconds / 60}m` : `${timeInSeconds}s`;

log(`took ${finalTime}- process finished with success`);
