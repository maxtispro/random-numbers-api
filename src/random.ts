import assert from "assert";
import fs, { createReadStream } from "fs";
import { createHash } from "crypto";

export function hashFile512(filePath: string): Promise<string> {
  assert(fs.existsSync(filePath), `[hash.ts] file ${filePath} was not found`);
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
