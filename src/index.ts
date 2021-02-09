console.log('event-logger-service started');
import { TDBWritter } from './db/dbwritter';
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './http/server/httpserver';
import { IEvent } from './interfaces/iDBEvent';
import { validation } from './Devices/controller';
import { dataset } from './Devices/dataset';
import { doTriggers } from './Devices/deviceparser';
import {TTriggersTemplate, createTemplateOfTriggersGroup } from './Triggers/Group/TriggersTemplate';
import { TTriggers } from './Triggers/Triggers';
import { TDevicesValueStore } from './http/client/devices';

//const Server: HttpServer = new HttpServer();
const DBWritter = new TDBWritter();
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
const TriggersTemplates: Map<string, TTriggersTemplate> = createTemplateOfTriggersGroup(EventsSource);
/*TODO шаблоны триггеров подготовлены, наверно надо теперь сделать сами триггеры
в которые будут интегрированы шаблоны*/
const Triggers = new TTriggers({
    templates: TriggersTemplates,
      events: EventsSource,
        positions: DevicesPositionSource});

const devicesValueStore:TDevicesValueStore = new TDevicesValueStore();

const data = validation(dataset);
/**TODO сформировать запросы к Tagger*/

const reg: Array<any> = Triggers.getReqiests()


async function main(){
    await DBWritter.write(doTriggers(data, Triggers))
}

//main()

let i = 1;
function func(i: number) {
  console.log(i, data.U1['U1:RAM'].data['DIN.2(C2_AC)'])
  data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = 
    (data.U1['U1:RAM'].data['DIN.2(C2_AC)'] == 1)
    ? '0'
    : '1'
  main()
}

setTimeout(function run () {
  func(i++);
  setTimeout(run, 5000);
}, 100);

console.log('event-logger-service stoped')
