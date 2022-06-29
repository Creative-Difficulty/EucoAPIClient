import fetch from "node-fetch";

async function fetchBase64() {
    var APIresponse;
    await fetch("localhost:80", { method: "GET", headers: {"EucoAPIAuth": "IamRobot"}}).then(res => APIresponse = res.text());
    return APIresponse;
    //let buff = new Buffer(res.text(), 'base64');
    //let recievedJSON = buff.toString('ascii');
    //console.log(recievedJSON)
}

var resp = await fetchBase64();
console.log(resp);
