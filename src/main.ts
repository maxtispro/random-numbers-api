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
import { RandomTable, hashFile512, hash2Rand } from "./processdata.js";
import { FSListener, imgDir } from "./fsmanager.js";

// Constants
const app = express();
const port = 80;
const fsListener = new FSListener(imgDir);
const randomTable = new RandomTable();

// Update Random Table
fsListener.start(filePath => {
  return hashFile512(filePath).then(hash2Rand)
    .then(rand => randomTable.push(rand))
    .then(() => fsListener.deleteFile(filePath))
    .then(err => {
      if (err !== undefined) console.error(err);
      else console.log(randomTable.toString());
      return err === undefined;
    });
});

// Answer API Requests
app.get("/", (req, res) => {
  randomTable.pop().then(randObj => {
    res.json(randObj);
    console.log(`Random hash sent to ${req.ip}`);
  });
});

app.listen(port, () => {
  console.log(`Random Number API listening on port ${port}`);
});
