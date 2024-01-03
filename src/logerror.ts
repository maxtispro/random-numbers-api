import fsp from "fs/promises";
import { ProperDate } from "./util.js";

const errDir = "./errors/";

export async function reportError(err: any) {
  const date = new ProperDate();
  return fsp
    .writeFile(errDir + `${date.yearOf()}-${date.monthOf()}-${date.dayOf()}.log`, errorToString(err) + "\n", {
      flag: "a+",
    })
    .then(
      () => console.log(err, "Error Logged\n"),
      err => console.log(err)
    );
}

function errorToString(err: any): string {
  return Object.keys(err).reduce(
    (acc, key) => acc + `${key}: ${err[key].toString()}\n`,
    `${new Date().toLocaleTimeString()}\n${err.toString()}\n`
  );
}
