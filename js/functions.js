import fetch from "node-fetch"
import dotenv from "dotenv"
import path from "path"

const __dirname = path.resolve()

console.log(path.join(__dirname, ".env"))
dotenv.config({path: path.join(__dirname, ".env")});

export async function fetchEucoAPI() {
    var APIresponse;
    await fetch("http://localhost:8082", { method: "GET", headers: {"EucoAPIAuth": "IamRobot"}}).then(res => APIresponse = res.text());
    return APIresponse;
}