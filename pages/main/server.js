#!/usr/bin/env node
import express from "express";
import { isIP } from "net";
import path from "path";
import logger from "node-color-log"
import dotenv from "dotenv"
const __dirname = path.resolve()
const configPath = path.join(__dirname + "../../")
dotenv.config(configPath)
const app = express();
logger.setLevel("success");

if (process.env.port != null && !isNaN(parseFloat(process.env.port)) && process.env.port > 0 && process.env.port < 65535) {
  logger.info("Set port to " + process.env.port + ".");
} else {
  logger.warn("no port or unavailable port specified, defaulting to 8082."); 
  process.env.port = 8082;
}

if (process.env.mode === "normal" || process.env.mode === "production" || process.env.mode === "debug") {
  logger.info("Set mode to " + process.env.mode + ".");
} else {
  logger.warn("no mode or corrupted mode specified, defaulting to normal.");
  process.env.mode = "normal";
}


app.use("/img", express.static(path.join(__dirname, "img")));
app.use("/style.css", express.static(path.join(__dirname, "style.css")));
app.use("/lib", express.static(path.join(__dirname, "js")));
//app.use(express.static("DB"));


app.get("/", (req, res) => {
  if(process.env.mode == "debug") {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if(ip.includes("::1")) {
      logger.debug("request recieved from: localhost\nIP type: IPv6")
    } else if(ip.includes("::ffff:")){
      logger.debug("request recieved from: localhost\nIP type: IPv4")
    } else {
      if(isIP(ip) === 4) {
        logger.debug("request recieved from: " + ip + "\nIP type: IPv4")
      } else if (isIP(ip) === 6) {
        logger.debug("request recieved from: " + ip + "\nIP type: IPv6")
      } else {
        logger.debug("request recieved from: IP not accessible \nIP type: not accessible")
      }
    }
  }
  res.sendFile(path.join(__dirname, "index.html"))
})


app.listen(process.env.port, () => {
  logger.info("EucoAPIClient dashboard running at http://localhost:" + process.env.port);
})