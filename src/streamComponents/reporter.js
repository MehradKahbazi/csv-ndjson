import { PassThrough } from "node:stream";
import { log } from "../util";

export default class Reporter {
  #loggerFn;
  constructor({ logger = log } = {}) {
    this.#loggerFn = logger;
  }

  progress(amount) {
    const progress = PassThrough();
    return progress;
  }
}
