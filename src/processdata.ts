import fs from "fs";
import fsp from "fs/promises";
import { createHash } from "crypto";
import { Queue } from "./util.js";

/**
 * Base unit for the random data
 */
interface RandData {
  rand: number[];
  rand512: string;
  date: Date;
  flags?: string;
}

/**
 * Storage container for each RandData object
 * Is a queue (first in first out)
 */
export class RandomTable {
  private table: Queue<RandData> = new Queue();

  push(rand: RandData) {
    this.table.push(rand);
  }

  pop(): Promise<RandData> {
    return new Promise<RandData>(res => {
      while (this.table.isEmpty());
      res(this.table.pop());
    });
  }

  toString() {
    return JSON.stringify(this.table.toArray());
  }
}

const hexDigitCount = 16;
export function hash2Rand(hash: string): RandData {
  const nums: number[] = [];
  for (let i = 0; i < hash.length; i += hexDigitCount)
    nums.push(Number.parseInt(hash.slice(i, i + hexDigitCount), 16) / Math.pow(2, hexDigitCount * 4));
  return { rand: nums, rand512: hash, date: new Date(), flags: "*** Test Data - Only Use For Testing ***" };
}

export class FileHashError extends Error {}

export async function hashFile512(filePath: fs.PathLike): Promise<string> {
  if (!fs.existsSync(filePath)) throw new FileHashError(`File '${filePath.toString()}' not found`);
  const hash = createHash("sha512");
  return fsp
    .readFile(filePath)
    .then(buffer => hash.update(buffer))
    .then(hash => hash.digest("hex"));
}
