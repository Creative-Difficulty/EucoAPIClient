import fs from "fs"
import fetch from 'node-fetch'

var recievedJSON
var jsonTime
var jsonCpuUsage
var jsonRAM
var jsonTotalRAM
var jsonUsedRAM
var jsonFreeRAM
var cleared = false
let result = []
var jsonCPUinfo
var jsonCPUmodel
var jsonCPUCores
var jsonCPUSpeed
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
        
    })

    var parseableJSON = JSON.stringify({
        "time": jsonTime,
        "cpu_model": jsonCPUmodel,
        "cpu_speed": jsonCPUSpeed,
        "cpu_usage": jsonCpuUsage,
        "total_ram": jsonTotalRAM,
        "used_ram": jsonUsedRAM,
        "free_ram": jsonFreeRAM
    })

    result.push(parseableJSON)

    fs.writeFileSync("JSONStorage.json", JSON.stringify(result, null, 4))
}