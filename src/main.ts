import { hashFile512 } from "./random.js";
import express from "express";

const app = express();
const port = 80;

app.get("/", (req, res) => {
    hashFile512("./include/images/art.png").then(hash => {
        res.json(JSON.stringify({ rand512: hash }));
        console.log(`Random hash sent to ${req.ip}`);
    });
});

app.listen(port, () => {
    console.log(`Random Number API listening on port ${port}`);
});
