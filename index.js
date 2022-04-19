import fs from "fs"
import fetch from "node-fetch"
import JsonDB from "node-json-db"
import Config from "node-json-db/dist/lib/JsonDBConfig"

var LoggingDB = new JsonDB(new Config("JSONStorage.json", true, false, '/'));

var recievedJSON
var parseableJSON

var jsonTime

var jsonRAM
var jsonTotalRAM
var jsonUsedRAM
var jsonFreeRAM

var jsonCpuUsage
var jsonCPUinfo
var jsonCPUmodel
var jsonCPUCores
var jsonCPUSpeed

var jsonStorage
var jsonStorageCapacity
var jsonUsedStorage
var jsonFreeStorage

var jsonOSinfo
var jsonOSname
var jsonOSVersion
var jsonOSarchitecture
var jsonOSlocalIP
var jsonOStextEncoding
var jsonOSserialnumber
var jsonOSuefiboolean

fetch("http://localhost:5050/1")
fs.truncate("JSONStorage.json", 0, function () { })

setInterval(fetchJSON, 2000)

fs.appendFile("JSONStorage.json", "[", null, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});

async function fetchJSON() {
    await fetch("http://localhost:5050/1").then(jsonData => jsonData.json()).then(jsonData => {
        recievedJSON = jsonData

        jsonTime = recievedJSON["time"]
        jsonCpuUsage = recievedJSON["cpu_usage"]

        jsonRAM = recievedJSON["RAM"]
        jsonTotalRAM = jsonRAM["totalMemMb"]
        jsonUsedRAM = jsonRAM["usedMemMb"]
        jsonFreeRAM = jsonRAM["freeMemMb"]

        jsonCPUinfo = recievedJSON["cpu_type"]
        jsonCPUCores = jsonCPUinfo[1]
        jsonCPUmodel = jsonCPUCores["model"]
        jsonCPUSpeed = jsonCPUCores["speed"]

        jsonStorage = recievedJSON["storage_info"]
        jsonStorageCapacity = jsonStorage["totalGb"]
        jsonUsedStorage = jsonStorage["usedGb"]
        jsonFreeStorage = jsonStorage["freeGb"]

        jsonOSinfo = recievedJSON["os_version"]
        jsonOSname = jsonOSinfo["codename"]
        jsonOSVersion = jsonOSinfo["release"]
        jsonOSarchitecture = jsonOSinfo["arch"]
        jsonOSlocalIP = jsonOSinfo["hostname"]
        jsonOStextEncoding = jsonOSinfo["codepage"]
        jsonOSserialnumber = jsonOSinfo["serial"]
        jsonOSuefiboolean = jsonOSinfo["uefi"]
        
    })

    parseableJSON = JSON.stringify({
        "time": jsonTime,
        "cpu_model": jsonCPUmodel,
        "cpu_speed": jsonCPUSpeed,
        "cpu_usage": jsonCpuUsage,
        "total_ram": jsonTotalRAM,
        "used_ram": jsonUsedRAM,
        "free_ram": jsonFreeRAM,
        "total_storageGB": jsonStorageCapacity,
        "free_storageGB": jsonFreeStorage,
        "used_storageGB": jsonUsedStorage,
        "os_name": jsonOSname,
        "os_version": jsonOSVersion,
        "os_architecture": jsonOSarchitecture,
        "local_ip": jsonOSlocalIP,
        "pc_serial_number": jsonOSserialnumber,
        "uefi_is_enabled": jsonOSuefiboolean
    })

    await fs.appendFile("JSONStorage.json", JSON.stringify(parseableJSON), null, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
    await fs.appendFile("JSONStorage.json", ",", null, function (err) {
        if (err) throw err;
    });
}


process.on("exit", (code) => {
    fs.appendFile("JSONStorage.json", "]", null, function (err) {
        if (err) throw err;
        console.log('Done1');
    });
    console.log("Process exit event with code: ", code);
});
  

process.on("SIGTERM", (signal) => {
    fs.appendFile("JSONStorage.json", "]", null, function (err) {
        if (err) throw err;
        console.log('Done2');
    });
    console.log(`Process ${process.pid} received a SIGTERM signal`);
    process.exit(0);
});
  

process.on("SIGINT", (signal) => {
    fs.appendFile("JSONStorage.json", parseableJSON, null, function (err) {
        if (err) throw err;
    });
    fs.appendFileSync("JSONStorage.json", "]", null, function (err) {
        if (err) throw err;
    });
    console.log('Done');
    console.log(`Process ${process.pid} has been terminated by ${signal}`);
    process.exit(0);
});
  

