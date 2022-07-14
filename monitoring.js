#!/usr/bin/env node

import dotenv from "dotenv";
import { exit } from "process";
import fs from "fs"
import isValidHttpURL from "./lib/util/isValidHttpURL.js"
import initLogger from "./lib/util/initLogger.js";
import log4js from "log4js";
import path from "path";
import checkArgv from "./lib/util/checkArgv.js";
import checkEucoAPI from "./lib/util/checkEucoAPI.js";
import checkENV from "./lib/util/checkENV.js";

dotenv.config();

export var ENVchecked = false;
await checkENV();
var ENVchecked = true;

export var Argvchecked = false;
await checkArgv();
var Argvchecked = true;


const LoggerConfig = await initLogger();
log4js.configure(LoggerConfig)
export const logger = log4js.getLogger();

export const EucoAPIreachable = await checkEucoAPI();
if(!EucoAPIreachable) {
    logger.error("EucoAPI is not reachable on the URL provided")
    process.exit(1);
}

const __dirname = path.resolve()


if(/\s/.test(process.env.FETCH_URL) || !isValidHttpURL(process.env.FETCH_URL)) {
    logger.warn("The environment variable FETCH_URL contains a whitespace or isnt properly set, defaulting to http://localhost:8082");
    process.env.FETCH_URL = "http://localhost:8082"
}
if(/\s/.test(process.env.TOKEN) || process.env.TOKEN === undefined || process.env.TOKEN === null) {
    logger.error("The environment variable TOKEN contains a whitespace or isnt properly set, EucoAPIClient cannot run without it!");
    exit(1);
}

var currentdate = new Date();
var datetime = currentdate.getDate() + "." + (currentdate.getMonth() + 1) + "." + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
var newDBName = "DB-" + datetime + ".json";

await fs.promises.open(path.join(__dirname, "pages", "main", "DB", newDBName), 'w')
logger.info("Created new database file with name: " + newDBName);

setInterval(fetchJSON, 20000)
const Appendstream = fs.createWriteStream(path.join(__dirname, "pages", "main", "DB", newDBName), {flags:'a'});


async function fetchJSON() {
    var recievedJSON = await fetch(process.env.FETCH_URL, { method: "GET", headers: {"authentication": "1156523efb3bbd2b08d1959e31084bb1ebc92c612666ceff501f2c229ac3aa57ab18187b6a273de63148c58ce98a8be3"}}).then(res => res.text());
    recievedJSON = Buffer.from(recievedJSON, 'base64').toString('utf8')
    Appendstream.write(recievedJSON)
}

