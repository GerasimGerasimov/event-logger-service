console.log('event-log-reader started');
import fs = require('fs');

import TDAO  from './DB/DAO';
import EventsRepositoty from './DB/EventsRepository';

import { HttpServer } from './server/httpserver';
import { getConfigFile } from './helpers/utils';

const settings = JSON.parse(fs.readFileSync(getConfigFile(), 'utf8'));
const Server: HttpServer = new HttpServer(settings.HOST.port);


/*
async function main(){
  const dao: TDAO = new TDAO('./db/database.sqlite3');
  const eventsRepo = new EventsRepositoty(dao);
}

main()
console.log('stop')
*/

/*
  try {

    console.log('start to create table')
    await eventsRepo.createTable();

    console.log('start row count:', await eventsRepo.getRowCount())
    
    async function* asyncGenerator(max: number) {
      let i = 0;
      while (i < max) {
        yield i++;
      }
    }

    console.log('start to create records')

  
    await dao.run('BEGIN TRANSACTION');
    var index:number = 0;
    for await (let i of asyncGenerator(2048)) {
      const eventSource = createEvent(faker.random.number({
        'min': 0,
        'max': EventsMap.size - 1})
        )
        if (eventSource !== undefined) {
          const {datetime, tag, details} = {... eventSource}
          const { type, initialValue, comment, todo } = { ... details}
          const event: IEvent = {
            date: datetime,
            type,
            tag,
            details : {
              initialValue,
              comment,
              todo
            }
          }
          await eventsRepo.create(event)
          console.log(`create record: ${i} ${type} ${tag}`)
          

        } else {
          console.log(`Error on record ${i}`)
        }
    }

  } catch(e) {
    console.log('Error :', e)
  }
    await dao.run('COMMIT TRANSACTION');
    console.log('end row count:', await eventsRepo.getRowCount())
    console.log('event-log-sqlite stoped');

*/