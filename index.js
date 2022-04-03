import fs from "fs"
import fetch from 'node-fetch'
import exit from "process"
import readline from 'readline'
import os from 'os'
import stringify from "querystring"

var recievedJSON
var jsonTime
var jsonCpu
var cleared = false
let result = []
var JSONInterval = setInterval(fetchJSON, 2000)


readline.emitKeypressEvents(process.stdin);


if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

console.log("Press q to stop EucoAPIClient at any time! \nWARNING: IF YOU STOP EUCOAPICLIENT FROM RUNNING IN ANY OTHER WAY, CHANGES WILL BE SAVED IMPROPERLY!")


function clearFile(file) {
    fs.truncate(file, 0, function(){})
}
  

async function fetchJSON() {
    if(cleared == false) {
        clearFile("JSONStorage.json")
        cleared = true
    }
    
    await fetch("http://localhost:8080/1").then(jsonData => jsonData.json()).then(jsonData => {
        recievedJSON = jsonData
        jsonTime = recievedJSON["time"]
        jsonCpu = recievedJSON["cpu_usage"]
    })

    var parseableJSON2 = JSON.stringify({
        "time": jsonTime,
        "cpu_usage": jsonCpu
    })

    result.push(parseableJSON2)

    fs.writeFileSync("JSONStorage.json", JSON.stringify(result, null, 4))
}