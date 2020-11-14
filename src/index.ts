console.log('event-log-reader started');
import fs = require('fs');

//import TDAO  from './DB/DAO';
//import EventsRepositoty from './DB/EventsRepository';

import { HttpServer } from './server/httpserver';
import { getConfigFile } from './helpers/utils';

const settings = JSON.parse(fs.readFileSync(getConfigFile(), 'utf8'));
const Server: HttpServer = new HttpServer(settings.HOST.port);



function main(){

}

main()
console.log('stop')