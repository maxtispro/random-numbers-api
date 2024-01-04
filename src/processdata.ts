import fs from "fs";
import fsp from "fs/promises";
import { createHash } from "crypto";
import { Queue } from "./util.js";

export const RANDDATALIFETIME = 5000;

/**
 * Base unit for the random data
 */
interface RandData {
  rand: number[];
  rand512: string;
  date: Date;
  flags?: string[];
}

/**
 * Storage container for each RandData object - 
 * Is a queue (first in first out)
 */
export class RandomTable {
  private table: Queue<RandData> = new Queue();

  push(rand: RandData) {
    this.table.push(rand);
  }

  /* private async awaitNext(): Promise<RandData> {
    return new Promise<RandData>(res => {
      while (this.table.isEmpty());
      res(this.table.peak());
    });
  } */

  randIsExpired(rand: RandData): boolean {
    return new Date().getTime() - rand.date.getTime() > RANDDATALIFETIME;
  }

  async pop(): Promise<RandData> {
    return new Promise<RandData>(resolve => {
      while (this.table.isEmpty());
      resolve(this.table.pop());
    });
    //return this.awaitNext().then(() => this.table.pop());
  }

  async popValid(): Promise<RandData> {
    return this.pop().then(rand => (this.randIsExpired(rand) ? this.popValid() : rand));
  }

  /* peak(): RandData | undefined {
    return this.table.isEmpty() ? undefined : this.table.peak();
  } */

  toString() {
    return JSON.stringify(this.table.toArray());
  }
}

const hexDigitCount = 16;
export function hash2Rand(hash: string, flags: string[]): RandData {
  const nums: number[] = [];
  for (let i = 0; i < hash.length; i += hexDigitCount)
    nums.push(Number.parseInt(hash.slice(i, i + hexDigitCount), 16) / Math.pow(2, hexDigitCount * 4));
  return { rand: nums, rand512: hash, date: new Date(), flags: flags };
}

export async function hashFile512(filePath: fs.PathLike): Promise<string> {
  const hash = createHash("sha512");
  return fsp
    .readFile(filePath)
    .then(buffer => hash.update(buffer))
    .then(hash => hash.digest("hex"));
}
