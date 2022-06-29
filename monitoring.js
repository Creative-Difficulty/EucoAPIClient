#!/usr/bin/env node

import { exit } from "process";
import fetch from "node-fetch"
import {fetchEucoAPI} from "./js/functions.js";
//TODO: migrate to react
import fs from "fs"
import logger from "node-color-log"
import path from "path";
import { zip } from "zip-a-folder";
const __dirname = path.resolve()

logger.setLevel("success")

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
        //clearBar.stop();
        //exit(0);
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

var currentdate = new Date();
var datetime = currentdate.getDate() + "."+(currentdate.getMonth()+1) + "." + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
var newDBName = "DB-" + datetime + ".txt";

fs.open(path.join(__dirname, "pages", "main", "DB", newDBName), 'w', function (err, file) {
    if (err) throw err;
    console.log("Created new database file with name: " + newDBName);
});

var LoggedNum = 0
var recievedJSON
var parseableData

setInterval(fetchJSON, 2000)
const Appendstream = fs.createWriteStream(path.join(__dirname, "pages", "main", "DB", newDBName), {flags:'a'});




async function fetchJSON() {
    var recievedJSON = await fetchEucoAPI();
    //console.log(JSON.parse(JSON.stringify(Buffer.from(recievedJSON, 'base64').toString('utf8'))));
    if(recievedJSON !== null || recievedJSON !== undefined) {
        recievedJSON = JSON.parse(JSON.stringify(Buffer.from(recievedJSON, 'base64').toString('utf8')));
    } else {
        return;
    }

    console.log(recievedJSON)
    
    
    if(parseableData !== null || parseableData !== undefined) {
        Appendstream.write(parseableData)
    }
}

