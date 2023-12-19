import fs from "fs";

export const imgDir = "./include/img/";
export type Listener = (filePath: fs.PathLike) => boolean | Promise<boolean>;

export class FSListener {
  private dir: fs.PathLike;
  private active = true;

  constructor(dir: fs.PathLike) {
    this.dir = dir;
  }

  async start(callback: Listener) {
    while (this.active) {
      this.active = await new Promise<fs.PathLike>(res =>
        fs.watch(this.dir, (_, filename) => res(imgDir + filename))
      ).then(callback);
    }
  }

  deleteFile(filePath: fs.PathLike): Promise<Error | undefined> {
    return new Promise<Error | undefined>(res => fs.rm(filePath, err => res(err ? err : undefined)));
  }
}
