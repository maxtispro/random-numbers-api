import fs from "fs";
import fsp from "fs/promises";

export const imgDir = "./include/img/";

export type Observer = (filePath: fs.PathLike) => Promise<void>;
export class FSObservable {
  private dir: fs.PathLike;
  private delayMS: number;
  private observers: Observer[] = [];
  constructor(dir: fs.PathLike, delayMS: number) {
    this.dir = dir;
    this.delayMS = delayMS;
  }
  subscribe(obs: Observer) {
    this.observers.push(obs);
  }
  async update(filePath: fs.PathLike): Promise<void> {
    return Promise.allSettled(this.observers.map(obs => obs(this.dir.toString() + filePath.toString())))
      .then();
  }
  async start(): Promise<void> {
    return fsp.readdir(this.dir)
      .then(async files => {
        if (files.length > 0) return this.update(files[0]).then(() => this.start());
        return new Promise<void>(res => setTimeout(res, this.delayMS))
          .then(() => this.start());
      });
  }
}
