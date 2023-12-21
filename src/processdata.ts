import fs from "fs";
import fsp from "fs/promises";
import { createHash } from "crypto";

interface RandData {
  rand: number[];
  rand512: string;
  flags?: string;
}

export class RandomTable {
  private table: RandData[] = [];

  push(rand: RandData) {
    this.table.push(rand);
  }

  pop(): Promise<RandData> {
    return new Promise<RandData>(res => {
      while (this.table.length === 0);
      res(this.table.pop() as RandData);
    });
  }

  toString() {
    let str = "[\n";
    for (const rand of this.table) {
      str += "  {\n    rand: [\n";
      for (const n of rand.rand) {
        str += `      ${n}\n`;
      }
      str += "    ]\n  }\n";
      str += `  rand512: '${rand.rand512}'\n`;
      str += rand.flags ? `  flags: '${rand.flags}\n'` : "";
    }
    return str + "\n]\n";
  }
}

const hexDigitCount = 16;
export function hash2Rand(hash: string): RandData {
  const nums: number[] = [];
  for (let i = 0; i < hash.length; i += hexDigitCount)
    nums.push(Number.parseInt(hash.slice(i, i + hexDigitCount), 16) / Math.pow(2, hexDigitCount * 4));
  return { rand: nums, rand512: hash, flags: "*** Test Data - Only Use For Testing ***" };
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
