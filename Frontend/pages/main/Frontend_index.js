import express from "express"
import { isIP } from "net"
import path from "path"

const app = express()
const port = 3000
const __dirname = path.resolve()

app.use("/img", express.static(__dirname + "/img"));
app.use("/style.css", express.static(__dirname + "/style.css"));
app.use("/lib", express.static(__dirname + "/js"));


app.get('/', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  if(ip.includes("::1")) {
    console.log("request recieved from: " + "localhost" + "\nIP type: IPv6")
  } else if(ip.includes("::ffff:")){
    console.log("request recieved from: " + "localhost" + "\nIP type: IPv4")
  } else {
    if(isIP(ip) === 4) {
      console.log("request recieved from: " + ip + "\nIP type: IPv4")
    } else if (isIP(ip) === 6) {
      console.log("request recieved from: " + ip + "\nIP type: IPv6")
    } else {
      console.log("request recieved from: " + "IP not accessible" + "\nIP type: not accessible")
    }
  }
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
  console.log("Static file server running at\n  => http://localhost:" + port);
})