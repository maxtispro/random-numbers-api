import fs from "fs";
import fsp from "fs/promises";
import { reportError } from "./logerror.js";
import { setTimeout } from "timers/promises";

export const imgDir = "./include/img/";

export type Observer = (filePath: fs.PathLike) => Promise<void>;

export class FSObservable {
  private dir: fs.PathLike;
  private delayMS: number;
  private observers: Observer[] = [];
  private files: fs.PathLike[] = [];

  constructor(dir: fs.PathLike, delayMS: number) {
    this.dir = dir;
    this.delayMS = delayMS;
  }

  subscribe(obs: Observer) {
    this.observers.push(obs);
  }

  async update(filepath: fs.PathLike): Promise<void> {
    return Promise.allSettled(this.observers.map(obs => obs(filepath))).then();
  }

  async start(): Promise<void> {
    return this.nextFile()
      .then(async filepath => {
        return this.update(filepath);
      })
      .catch(reportError)
      .then(() => this.start());
  }

  private async nextFile(): Promise<fs.PathLike> {
    return this.updateFiles().then(async () => {
      this.files = this.files.filter(file => this.fileIsValid(file));
      if (this.files.length > 0) return this.files[0];
      return setTimeout(this.delayMS).then(() => this.nextFile());
    });
  }

  private async updateFiles(): Promise<void> {
    if (this.files.length > 0) return Promise.resolve();
    return fsp
      .readdir(this.dir)
      .then(files => {
        if (files.length === 0) return setTimeout(this.delayMS).then(() => fsp.readdir(this.dir));
        return files;
      })
      .then(files => {
        this.files = files.map(file => this.dir.toString() + file.toString());
      });
  }

  private fileIsValid(filepath: fs.PathLike): boolean {
    try {
      fs.closeSync(fs.openSync(filepath, "r+"));
      return true;
    } catch {}
    return false;
  }
}

export async function delFile(filepath: fs.PathLike, waitTime: number): Promise<void> {
  return fsp
    .open(filepath, "r+")
    .then(async fd => {
      return fsp
        .unlink(filepath)
        .then(() => fd.close())
        .catch(() =>
          fd
            .close()
            .then(() => setTimeout(waitTime))
            .then(() => delFile(filepath, waitTime))
        );
    })
    .catch((err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") console.log(`${filepath.toString()} already deleted`);
      throw err;
    });
}

export function delFile_old(filePath: fs.PathLike) {
  fs.open(filePath, "r+", function (err, fd) {
    if (err && err.code === "EBUSY") {
      //do nothing till next loop
    } else if (err && err.code === "ENOENT") {
      console.log(filePath, "deleted");
    } else {
      fs.close(fd, function () {
        fs.unlink(filePath, function (err) {
          if (err) {
          } else {
            console.log(filePath, "deleted");
          }
        });
      });
    }
  });
}

/* export function awaitFileAccess(filePath: fs.PathLike): Promise<void> {
  const check = () => {
    try {
      fs.closeSync(fs.openSync(filePath, "r+"));
      return true;
    } catch {
      return false;
    }
  }
  const fileCheckQ = new Queue<boolean>();
  return new Promise<void>(res => {
    for (let i = 0; i < 1000; i++) fileCheckQ.push(check());
    //console.log(JSON.stringify(fileCheckQ.toArray()));
    while (!fileCheckQ.toArray().every(b => b)) {
      fileCheckQ.push(check());
      fileCheckQ.pop();
    }
    //console.log(JSON.stringify(fileCheckQ.toArray()));
    res();
  });
} */
