import { Transform } from "node:stream";
export default class CSVToNDJSON extends Transform {
  #delimiter = "";
  #headers = [];
  constructor({ delimiter = ",", headers }) {
    super();

    this.#delimiter = delimiter;
    this.#headers = headers;
  }

  _transform(chunk, encoding, callback) {
    callback(null, chunk);
  }

  // when it finishes processing
  // this.push(null) on the readable side
  _final(callback) {
    callback();
  }
}
