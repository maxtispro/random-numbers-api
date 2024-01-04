/**
 * Random Number Processing Server
 *
 * Async Operations:
 *  1. build random table as new images arrive
 *  2. answer api requests with random numbers from the table
 *
 * Deletion Procedures:
 *  - images deleted as soon as they are processed
 *  - random numbers deleted from the table as soon as they are sent
 *  - no random number older than 5 seconds is sent
 */

import express from "express";
import { RandomTable, hashFile512, hash2Rand } from "./processdata.js";
import { FSObservable, delFile, imgDir } from "./fsmanager.js";
import { ManualOverrides } from "./commands.js";
import { reportError } from "./logerror.js";

// Constants
const app = express();
const port = 80; // for testing purposes
const fsObs = new FSObservable(imgDir, 1000);
const randomTable = new RandomTable();

// Update Random Table
fsObs.subscribe(async filepath => {
  return (
    hashFile512(filepath)
      .then(path => hash2Rand(path, ["*** Test Data - Only Use For Testing ***"]))
      .then(rand => randomTable.push(rand))
      .then(() => console.log(`${filepath} hashed and processed`))
      //.then(() => fsp.rm(filePath))
      .then(() => delFile(filepath, 300))
      .then(() => console.log(`${filepath} deleted`))
      //.then(() => console.log(randomTable.toString()))
      .catch(reportError)
  );
});
fsObs.start();

// Answer API Requests
app.get("/", (request, response) => {
  randomTable
    .popValid()
    .then(randObj => {
      response.json(randObj);
      console.log(`Random data sent to ${request.ip}`);
    })
    .catch(reportError);
});

app.listen(port, () => {
  console.log(`Random Number API listening on port ${port}`);
});

// Server Side Override Inputs
/* function stop() {
  randomTable.stop();
}

(new ManualOverrides()).start(); */
