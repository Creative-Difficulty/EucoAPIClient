import express from "express"
import path from "path"

const app = express()
const port = 3000
const __dirname = path.resolve()

app.use("/img", express.static(__dirname + "/img"));
app.use("/style.css", express.static(__dirname + "/style.css"));
app.use("/lib", express.static(__dirname + "/lib"));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
  console.log("Static file server running at\n  => http://localhost:" + port);
})