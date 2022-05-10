import fs from "fs"
import fetch from "node-fetch"
import path from "path";
import logger from "node-color-log"
import { exit } from "process";
import isPi from "detect-rpi"
import cliProgress from "cli-progress"
import JSZip from "jszip";
const __dirname = path.resolve()

var zip = new JSZip();

logger.setLevel("success")
if(isPi()) {
    console.log("EucoAPIClient is running on a Raspberry Pi!")
} else {
    console.log("EucoAPIClient isnt running on a Raspberry Pi!")
}
process.argv.shift();
process.argv.shift();

if(process.argv.includes("-help") || process.argv.includes("-h")) {
    console.log(`
                
                    Welcome to the EucoAPIClient help menu!

    COMMAND     USAGE                                               ALIAS
    ---------------------------------------------------------------------
    -help       shows this menu                                     -h
    -clear      clears/deletes the Database                         -c / -delete / -del
    -list       shows the list of files in the database             -l
    -debug      prints debugging messagees into the console         -d
    -zip        creates a zip archive of all files in the database  -z
    `)

    process.exit(0);
} else if(process.argv.includes("-clear") || process.argv.includes("-c") || process.argv.includes("-delete") || process.argv.includes("-del")) {
    console.log("Deleting all files in the database...");
    const clearBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const directory = path.resolve(__dirname, "DB");

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
    fs.readdir(path.resolve(__dirname, "DB"), function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        console.log("Database files: ")
        files.forEach(function (file) {
            console.log(file); 
        });
        exit(0);
    });
}



var currentdate = new Date();
var datetime = currentdate.getDate() + "."+(currentdate.getMonth()+1) + "." + currentdate.getFullYear() + "@" + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
var newDBName = "./DB/DB-" + datetime + ".txt";

fs.open(newDBName, 'w', function (err, file) {
    if (err) throw err;
    console.log("Created new database file with name: " + newDBName);
});

var LoggedNum = 0
var recievedJSON
var parseableData

await fetch("https://eucoapi.herokuapp.com")

setInterval(fetchJSON, 10000)
const Appendstream = fs.createWriteStream(newDBName, {flags:'a'});


async function fetchJSON() {
    await fetch("https://eucoapi.herokuapp.com").then(jsonData => jsonData.json()).then(jsonData => {
        recievedJSON = jsonData
    })
    
    if(LoggedNum > 1) {
        var jsonTime = recievedJSON["time"]
        var jsonCpuUsage = recievedJSON["cpu_usage"]
        
        var jsonRAM = recievedJSON["RAM"]
        var jsonUsedRAM = jsonRAM["usedMemMb"]
        var jsonFreeRAM = jsonRAM["freeMemMb"]
        
        
        var jsonStorage = recievedJSON["storage_info"]
        var jsonUsedStorage = jsonStorage["usedGb"]
        var jsonFreeStorage = jsonStorage["freeGb"]
        
        
        
        parseableData = "time=" + jsonTime + "," + "cpu_usage=" + jsonCpuUsage + "," + "used_ram=" + jsonUsedRAM + "," + "free_ram=" + jsonFreeRAM + "," + "free_storageGB=" + jsonFreeStorage + "," + "used_storageGB=" + jsonUsedStorage + "\n"

    } else {
        var jsonTime = recievedJSON["time"]
        var jsonCpuUsage = recievedJSON["cpu_usage"]
        
        var jsonRAM = recievedJSON["RAM"]
        var jsonTotalRAM = jsonRAM["totalMemMb"]
        var jsonUsedRAM = jsonRAM["usedMemMb"]
        var jsonFreeRAM = jsonRAM["freeMemMb"]
        
        var jsonCPUinfo = recievedJSON["cpu_type"]
        var jsonCPUCores = jsonCPUinfo[1]
        var jsonCPUmodel = jsonCPUCores["model"]
        var jsonCPUSpeed = jsonCPUCores["speed"]
        
        var jsonStorage = recievedJSON["storage_info"]
        var jsonStorageCapacity = jsonStorage["totalGb"]
        var jsonUsedStorage = jsonStorage["usedGb"]
        var jsonFreeStorage = jsonStorage["freeGb"]
        
        var jsonOSinfo = recievedJSON["os_version"]
        var jsonOSname = jsonOSinfo["codename"]
        var jsonOSVersion = jsonOSinfo["release"]
        var jsonOSarchitecture = jsonOSinfo["arch"]
        var jsonOSlocalIP = jsonOSinfo["hostname"]
        var jsonOStextEncoding = jsonOSinfo["codepage"]
        var jsonOSserialnumber = jsonOSinfo["serial"]
        var jsonOSuefiboolean = jsonOSinfo["uefi"]

        if(jsonOSserialnumber === null) {
            jsonOSserialnumber = "not available"
        }
        
        parseableData = "time=" + jsonTime + "," + "cpu_model=" + jsonCPUmodel + "," + "cpu_speed=" + jsonCPUSpeed + "," + "cpu_usage=" + jsonCpuUsage + "," + "total_ram=" + jsonTotalRAM + "," + "used_ram=" + jsonUsedRAM + "," + "free_ram=" + jsonFreeRAM + "," + "total_storageGB=" + jsonStorageCapacity + "," + "free_storageGB=" + jsonFreeStorage + "," + "used_storageGB=" + jsonUsedStorage + "," + "os_name=" + jsonOSname + "," + "os_version=" + jsonOSVersion + "," + "os_architecture=" + jsonOSarchitecture + "," + "local_ip=" + jsonOSlocalIP + "," + "pc_serial_number=" + jsonOSserialnumber + "," + "uefi_is_enabled=" + jsonOSuefiboolean + "," + "os_text_encoding=" + jsonOStextEncoding + "\n"
        
        
    }
    LoggedNum++;
    
    
    
    Appendstream.write(parseableData)
}

