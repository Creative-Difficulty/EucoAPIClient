import dotenv from "dotenv";
import fetch from "node-fetch"
import path from "path"

const __dirname = path.resolve()

console.log(path.join(__dirname, ".env"))
dotenv.config({path: path.join(__dirname, ".env")});

export default async function fetchEucoAPI() {
    
    var APIresponse = await fetch("http://localhost:8082", { method: "GET", headers: {"EucoAPIAuth": "IamRobot"}}).then(res => res.text());
    return APIresponse;
}