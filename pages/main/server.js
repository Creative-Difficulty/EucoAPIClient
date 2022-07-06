#!/usr/bin/env node

import dotenv from "dotenv"
import express from "express";
import fs from "fs";
import { isIP } from "net";
import logger from "node-color-log"
import path from "path";
//TODO: at path /DBList readDirectory DB => display alll files in directory
const __dirname = path.resolve()
const configPath = path.join(__dirname + "../../")
dotenv.config(configPath)
const app = express();
logger.setLevel("success");

if(process.env.PORT === "" || /\s/.test(process.env.PORT) || process.env.PORT === null || process.env.PORT === undefined || /^\d+$/.test(process.env.PORT)) {
  logger.warn("The environment variable PORT isnt set or isnt properly set, defaulting to 8083")
  process.env.PORT = 8083
}

if(/\s/.test(process.env.LOGLEVEL) || process.env.LOGLEVEL === "" || process.env.LOGLEVEL !== "WARN" && process.env.LOGLEVEL !== "ALL" && process.env.LOGLEVEL !== "INFO" && process.env.LOGLEVEL !== "ERROR" && process.env.LOGLEVEL !== "DEBUG") {
    logger.level = "INFO";
    logger.warn("The environment variable LOGLEVEL isnt set or isnt properly set, defaulting to INFO");
} else {
    logger.level = process.env.LOGLEVEL;
}


app.use("/DB", express.static("DB"));
app.use("/img", express.static(path.join(__dirname, "img")));
app.use("/style.css", express.static(path.join(__dirname, "style.css")));
app.use("/lib", express.static(path.join(__dirname, "js")));
//app.use(express.static("DB"));


app.get("/", (req, res) => {
  if(process.env.LOGLEVEL == "DEBUG") {
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

app.get("/DBList", (req, res) => {
  fs.readdir("./DB", (err, files) => {
    if (err)
      res.send(err.message);
    else {
      res.send(files);
    }
  })
})




app.listen(process.env.port, () => {
  logger.info("EucoAPIClient dashboard running at http://localhost:" + process.env.port);
})