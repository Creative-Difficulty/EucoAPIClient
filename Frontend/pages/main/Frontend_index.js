import express from "express"
import http from "http"
import path from "path"

const app = express();
var server = http.createServer(app);
var port = 3000;

const __dirname = path.resolve();


server.listen(port, function () {
    console.log('Webserver läuft und hört auf Port %d', port);
});

app.use(express.static(__dirname + '/public'));
app.use('main/img', express.static('image'))