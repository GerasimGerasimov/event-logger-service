import http = require('http');
import express = require("express");
import bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json()

export class HttpServer{
    public https: any;

    private port: number;
    
    constructor (port: number) {
        this.port = port;
        this.init();
    }

    private init () {
        app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });

        app.route('/v1/data/:id')
            .get(jsonParser, [this.get.bind(this)])
        
        app.route('/v1/data/')
            .put(jsonParser, [this.put.bind(this)]);
        
        this.https = http.createServer(app).listen(this.port);
        console.log('events-log-reader server started at port: ', this.port);
    }

    private async get (request: any, response: any) {
        console.log(`/v1/data/> ${request.params.id || ''}`);
            try {
                response.json('apply GET') //response.json(await this.com.getCOMAnswer(request.body));
            } catch (e) {
                response.status(400).json({status:'Error',
                                           msg: e.message || ''})
            }
    }

    private async put (request: any, response: any) {
        console.log(`/v1/data/> ${request.body.cmd || ''}`);
            try {
                response.json('apply PUT')  //response.json(await this.com.getCOMAnswer(request.body));
            } catch (e) {
                response.status(400).json({status:'Error',
                                           msg: e.message || ''})
            }
    }    
}