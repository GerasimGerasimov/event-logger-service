import http = require('http');
import express = require("express");
import cors = require('cors');

const app = express();

export default class HttpServer{
    public https: any;

    private port: number;


   constructor (port: number) {
    this.port = port;
    this.init()
}

    private init () {
      app.use(cors())
      this.https = http.createServer(app).listen(this.port);
      console.log(`Server started at ${this.port} port`)
    }
}