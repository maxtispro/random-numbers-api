import fsp from "fs/promises";

const errDir = "./errors/";

export async function reportError(err: Error) {
  const date = new Date();
  console.error(err);
  return fsp
    .writeFile(
      errDir + `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}.log`,
      `${date.toString()}\n${err.name}\n${err.message}\n${err.stack ? err.stack : "*** No Stack Trace ***"}\n\n`,
      { flag: "a+" }
    )
    .catch(err => console.log(err));
}
