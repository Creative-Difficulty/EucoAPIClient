import fs from "fs"
import fetch from 'node-fetch'

var cleared = false
let toWriteArray = []
var recievedJSON
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
setInterval(fetchJSON, 2000)


async function fetchJSON() {
    if(cleared == false) {
        fs.truncate("JSONStorage.json", 0, function () { })
        cleared = true
    }
    
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

    var parseableJSON = JSON.stringify({
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

    toWriteArray.push(parseableJSON)

    fs.writeFileSync("JSONStorage.json", JSON.stringify(toWriteArray, null, 4))
}