#!/usr/bin/env node
import express from "express";
import { isIP } from "net";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import logger from "node-color-log"

const argv = yargs(hideBin(process.argv)).argv;
const app = express();
logger.setLevel("error");

if (!isNaN(parseFloat(argv.port)) && argv.port > 0 && argv.port < 65535) {
  logger.info("Set port to " + argv.port + ".");
} else {
  logger.warn("no port or unavailable port specified, defaulting to 8082."); 
  argv.port = 8082;
}

if (argv.mode === "normal" || argv.mode === "production" || argv.mode === "debug") {
  logger.info("Set mode to " + argv.mode + ".");
} else {
  logger.warn("no mode or corrupted mode specified, defaulting to normal.");
  argv.mode = "normal";
}

const __dirname = path.resolve()

app.use("/img", express.static(path.join(__dirname, "img")));
app.use("/style.css", express.static(path.join(__dirname, "style.css")));
app.use("/lib", express.static(path.join(__dirname, "js")));
app.use("/Backend/DB", express.static(path.join(__dirname, "..", "..", "..", "Backend", "DB")));


app.get('/', (req, res) => {
  if(argv.mode == "debug") {
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
  res.sendFile(__dirname + "/index.html")
})


app.listen(argv.port, () => {
  logger.info("EucoAPIClient dashboard running at http://localhost:" + argv.port);
})