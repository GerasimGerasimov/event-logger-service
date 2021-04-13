import http = require('http');
import express = require("express");

const app = express();

export default class HttpServer{
    public https: any;

    private port: number;


   constructor (port: number) {
    this.port = port;
    this.init()
}

    private init () {
      app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        next();
      });

      this.https = http.createServer(app).listen(this.port);
    }
}