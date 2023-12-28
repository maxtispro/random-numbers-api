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
 */

import express from "express";
import fsp from "fs/promises"
import { RandomTable, hashFile512, hash2Rand, FileHashError } from "./processdata.js";
import { FSObservable, imgDir } from "./fsmanager.js";
import { ManualOverrides } from "./commands.js";
import { reportError } from "./logerror.js";

// Constants
const app = express();
const port = 80;
const fsObs = new FSObservable(imgDir, 1000);
const randomTable = new RandomTable();

// Update Random Table
fsObs.subscribe(async filePath => {
  return hashFile512(filePath)
    .then(hash2Rand)
    .then(rand => randomTable.push(rand))
    .then(() => fsp.rm(filePath))
    //.then(() => console.log(randomTable.toString()))
    .catch(reportError);
});
fsObs.start();

// Answer API Requests
app.get("/", (req, res) => {
  randomTable
    .pop()
    .then(randObj => {
      res.json(randObj);
      console.log(`Random hash sent to ${req.ip}`);
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
