#!/usr/bin/env node

import { exit } from "process";
import fs from "fs"
import path from "path";
import { zip } from "zip-a-folder";
import { ENVchecked, logger } from "../../monitoring.js";

const __dirname = path.resolve()


export default async function checkArgv() {
    if(!ENVchecked) {logger.error("Something went wrong while checking Environment Variables or Program Arguments"); exit(1);}
    process.argv.shift();
    process.argv.shift();
    
    if(process.argv.includes("-help") || process.argv.includes("-h")) {
        logger.info(`
                    
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
        logger.info("Deleting all files in the database...");
        const directory = path.join(__dirname, "pages", "main", "DB");
        const files = await fs.promises.readdir(directory);
        var filesList = [];
        
        files.forEach(function (file) {
            if (path.extname(file) === ".txt") {
                filesList.push(file);
            }
        });

        for (const file of filesList) {
            await fs.promises.unlink(path.join(directory, file))
        }
        logger.info("Done!")

        exit(0);
    } else if (process.argv.includes("-list") || process.argv.includes("-l")) {
        const files = await fs.promises.readdir(path.join(__dirname, "pages", "main", "DB"))
        logger.info("Database files: ")
        files.forEach(function (file) {
            logger.info(file);
        });
        exit(0);
    
    } else if(process.argv.includes("-zip") || process.argv.includes("-z")) {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "."+(currentdate.getMonth()+1) + "." + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + "-Backup.zip";
        const zipLocation = path.join(__dirname, "ZIPs", datetime);
        await zip(path.join(__dirname, "pages", "main", "DB"), zipLocation);
        exit(0)
    }
}