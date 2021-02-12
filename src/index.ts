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
import { devicesInfoStore } from './http/client/devicesinfo';

//const Server: HttpServer = new HttpServer();
const DBWritter = new TDBWritter();
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
const TriggersTemplates: Map<string, TTriggersTemplate> = createTemplateOfTriggersGroup(EventsSource);
const Triggers = new TTriggers({
    templates: TriggersTemplates,
      events: EventsSource,
        positions: DevicesPositionSource});

const devicesValueStore:TDevicesValueStore = new TDevicesValueStore();

const data = validation(dataset);

async function* asyncGenerator() {
  let i = 0;
  while (true) {
    await devicesValueStore.getOnceData();
    yield i++;
  }
}

async function main() {
  try {
    await devicesInfoStore.getDevicesInfo();
    devicesValueStore.createTasks(Triggers.getReqiests());
    for await (let i of asyncGenerator()) {
      console.log(i);//сюда попадаю когда даные прочитаны
      const values: Set<IEvent> = doTriggers(data, Triggers);
      await DBWritter.write(values)
    }
  } catch (e) {
    console.log(e)
  }
  console.log('event-logger-service stoped')
}

main()

/*
async function _main(){
    await DBWritter.write(doTriggers(data, Triggers))
}


let i = 1;
function func(i: number) {
  console.log(i, data.U1['U1:RAM'].data['DIN.2(C2_AC)'])
  data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = 
    (data.U1['U1:RAM'].data['DIN.2(C2_AC)'] == 1)
    ? '0'
    : '1'
  _main()
}

setTimeout(function run () {
  func(i++);
  setTimeout(run, 5000);
}, 100);
*/


/*
Привет асинхронного цикла на генераторе
async function* asyncGenerator(max: number) {
  let i = 0;
  while (i < max) {
    yield i++;
  }
}

async function loop(){
  for await (let i of asyncGenerator(2048)) {
    console.log(i);
    await (async ()=>{})();
  }
}
*/