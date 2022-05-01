import fs from "fs"
import fetch from "node-fetch"


var stats = fs.statSync("./DB/DB.txt")
var DBSizeMB = stats.size / (1024*1024);
console.log("size of database on disk: ", DBSizeMB.toFixed(5) + "MB")

var LoggedNum = 0
var recievedJSON
var parseableData

await fetch("https://eucoapi.herokuapp.com")

setInterval(fetchJSON, 3000)
const Appendstream = fs.createWriteStream("./DB/DB.txt", {flags:'a'});


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
        
        
        
        parseableData = "time=" + jsonTime + " " + "cpu_usage=" + jsonCpuUsage + " " + "used_ram=" + jsonUsedRAM + " " + "free_ram=" + jsonFreeRAM + " " + "free_storageGB=" + jsonFreeStorage + " " + "used_storageGB=" + jsonUsedStorage + "\n"
        
            
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
        
        parseableData = "time=" + jsonTime + " " + "cpu_model=" + jsonCPUmodel + " " + "cpu_speed=" + jsonCPUSpeed + " " + "cpu_usage=" + jsonCpuUsage + " " + "total_ram=" + jsonTotalRAM + " " + "used_ram=" + jsonUsedRAM + " " + "free_ram=" + jsonFreeRAM + " " + "total_storageGB=" + jsonStorageCapacity + " " + "free_storageGB=" + jsonFreeStorage + " " + "used_storageGB=" + jsonUsedStorage + " " + "os_name=" + jsonOSname + " " + "os_version=" + jsonOSVersion + " " + "os_architecture=" + jsonOSarchitecture + " " + "local_ip=" + jsonOSlocalIP + " " + "pc_serial_number=" + jsonOSserialnumber + " " + "uefi_is_enabled=" + jsonOSuefiboolean + " " + "os_text_encoding=" + jsonOStextEncoding + "\n"
        
        
    }
    LoggedNum++;
    
    
    
    Appendstream.write(parseableData)
}

