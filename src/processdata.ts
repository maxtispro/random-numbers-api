import assert from "assert";
import fs, { createReadStream } from "fs";
import { createHash } from "crypto";

interface RandData {
  rand: number[] | string[];
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
      str += "  rand: [\n";
      for (const n of rand.rand) {
        str += `    ${n}\n`;
      }
      str += `  rand512: '${rand.rand512}'\n`;
      str += rand.flags ? `  flags: '${rand.flags}'` : "";
    }
    return str + "\n]";
  }
}

const hexDigitCount = 16;
export function hash2Rand(hash: string): RandData {
  const nums: number[] = [];
  for (let i = 0; i < hash.length; i += hexDigitCount)
    nums.push(Number.parseInt(hash.slice(i, i + hexDigitCount), 16) / Math.pow(2, hexDigitCount * 4));
  return { rand: nums, rand512: hash, flags: "*** Test Data - Only Use For Testing ***" };
}

export function hashFile512(filePath: fs.PathLike): Promise<string> {
  assert(fs.existsSync(filePath), `[processdata.ts] file ${filePath.toString()} was not found`);
  //assert(fs.accessSync(filePath, fs.constants.R_OK), `[hash.ts] permission denied to read ${filePath}`);
  const hash = createHash("sha512");
  const input = createReadStream(filePath);
  return new Promise(resolve =>
    input.on("readable", () => {
      // Only one element is going to be produced by the
      // hash stream.
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        resolve(hash.digest("hex"));
      }
    })
  );
}
