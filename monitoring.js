#!/usr/bin/env node

import dotenv from "dotenv";
import { exit } from "process";
import fetch from "node-fetch"
import fs from "fs"
import isValidHttpURL from "./js/isValidHttpURL.j"
import initLogger from "./lib/util/initLogger.js";
import log4js from "log4js";
import path from "path";
import { zip } from "zip-a-folder";

const logger = log4js.getLogger();
const LoggerConfig = await initLogger();
log4js.configure(LoggerConfig)

const __dirname = path.resolve()

process.argv.shift();
process.argv.shift();

if(process.argv.includes("-help") || process.argv.includes("-h")) {
    console.log(`
                
                    ➡ Welcome to the EucoAPIClient help menu!

    COMMAND     USAGE                                                   ALIAS               
    ---------------------------------------------------------------------------
    -help       shows this menu                                         -h
    -clear      clears/deletes the Database                             -c / -delete / -del
    -list       shows the list of files in the database                 -l
    -debug      prints debugging messagees into the console             -d
    -zip        creates a zip archive of all files in the database      -z
    -dbdir      shows the absolute file path to the database
    `)

    process.exit(0);
} else if(process.argv.includes("-clear") || process.argv.includes("-c") || process.argv.includes("-delete") || process.argv.includes("-del")) {
    console.log("Deleting all files in the database...");
    const clearBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const directory = path.join(__dirname, "pages", "main", "DB");

    fs.readdir(directory, (err, files) => {
        var filesList = [];
        
        files.forEach(function (file) {
            if (path.extname(file) === ".txt") {
                filesList.push(file);

            }
        });

        console.log(filesList)
        if (err) throw err;
        clearBar.start(filesList.length-1, 0);

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
                clearBar.increment(1);
            });
        }
        clearBar.stop();
        exit(0);
    });

    
} else if (process.argv.includes("-list") || process.argv.includes("-l")) {
    fs.readdir(path.join(__dirname, "pages", "main", "DB"), function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        console.log("Database files: ")
        files.forEach(function (file) {
            console.log(file); 
        });
        exit(0);
    });
} else if(process.argv.includes("-zip") || process.argv.includes("-z")) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "."+(currentdate.getMonth()+1) + "." + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "-Backup.zip";
    const zipLocation = path.join(__dirname, "ZIPs", datetime);
    await zip(path.join(__dirname, "pages", "main", "DB"), zipLocation);
    exit(0)
}

dotenv.config();

if(/\s/.test(process.env.FETCH_URL) || !isValidHttpURL(process.env.FETCH_URL)) {
    logger.warn("The environment variable FETCH_URL contains a whitespace or isnt properly set, defaulting to http://localhost:8082");
    process.env.FETCH_URL = "http://localhost:8082"
}
if(/\s/.test(process.env.TOKEN) || process.env.TOKEN === undefined || process.env.TOKEN === null) {
    logger.error("The environment variable TOKEN contains a whitespace or isnt properly set, EucoAPIClient cannot run without it!");
    exit(1);
}

var currentdate = new Date();
var datetime = currentdate.getDate() + "."+(currentdate.getMonth()+1) + "." + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
var newDBName = "DB-" + datetime + ".json";

fs.open(path.join(__dirname, "pages", "main", "DB", newDBName), 'w', function (err, file) {
    if (err) throw err;
    logger.info("Created new database file with name: " + newDBName);
});

setInterval(fetchJSON, 20000)
const Appendstream = fs.createWriteStream(path.join(__dirname, "pages", "main", "DB", newDBName), {flags:'a'});


async function fetchJSON() {
    var recievedJSON = await fetch(process.env.FETCH_URL, { method: "GET", headers: {"authentication": "d81707bf323e2f30085e3562cfd5e5959f679efcb16a3929bb1d9ac5b837652d4fbe4dd6c755196bbdbf4ab6db7cc2f0"}}).then(res => res.text());
    recievedJSON = JSON.stringify(Buffer.from(recievedJSON, 'base64').toString('utf8'))
    Appendstream.write(recievedJSON)
}

