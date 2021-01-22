console.log('event-logger-service started');
import TDAO from './db/controllers/sqlite/DAO';
import EventsRepositoty from './db/controllers/sqlite/EventsRepository';
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './http/server/httpserver';
import { IEvent } from './interfaces/iDBEvent';
import { validation } from './Test/controller';
import { dataset } from './Test/dataset';
import { doTriggers } from './Test/deviceparser';
import {TTriggersTemplate, createTemplateOfTriggersGroup } from './Triggers/Group/TriggersTemplate';
import { TTriggers } from './Triggers/Triggers';

const dao: TDAO = new TDAO('./db/database.sqlite3');
const eventsRepo = new EventsRepositoty(dao);
//const Server: HttpServer = new HttpServer();
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
const TriggersTemplates: Map<string, TTriggersTemplate> = createTemplateOfTriggersGroup(EventsSource);
/*TODO шаблоны триггеров подготовлены, наверно надо теперь сделать сами триггеры
в которые будут интегрированы шаблоны*/
const Triggers = new TTriggers({
    templates: TriggersTemplates,
      events: EventsSource,
        positions: DevicesPositionSource});
const data = validation(dataset);//data = U1:{U1:RAM{...}}
/*
doTriggers(data, Triggers);
data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '0';
doTriggers(data, Triggers);
data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '1';
doTriggers(data, Triggers);
data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '0';
doTriggers(data, Triggers);
data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '1';
doTriggers(data, Triggers);
//setValuesToTriggers(data, Triggers);
*/

async function main(){
  try {

    console.log('start to create table')
    await eventsRepo.createTable();

    console.log('start row count:', await eventsRepo.getRowCount())

    console.log('start to create records')

    await dao.run('BEGIN TRANSACTION');

    await putEventsToDB(doTriggers(data, Triggers));
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '0';
    await putEventsToDB(doTriggers(data, Triggers));
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '1';
    await putEventsToDB(doTriggers(data, Triggers));
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '0';
    await putEventsToDB(doTriggers(data, Triggers));
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '1';
    await putEventsToDB(doTriggers(data, Triggers));

  } catch(e) {
    console.log('DB Error :', e)
  }

  await dao.run('COMMIT TRANSACTION');
  console.log('end row count:', await eventsRepo.getRowCount())
  console.log('event-log-sqlite stoped');
}

main()

async function putEventsToDB(values: Set<IEvent>) { 
  for (const value of values) {
    console.log(`create record: ${value.date}, ${value.tag}`)
    await eventsRepo.create(value)
  }
}

console.log('event-logger-service stoped')
