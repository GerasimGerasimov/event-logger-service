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

/*TODO оказывается триггер не "защёлкивается", и сколько раз прочитали что PWR = 1,
столько и записей будет в базе. Вернее надо чтобы в Set попадали только новые события*/
async function main() {
  try {
    await devicesInfoStore.getDevicesInfo();
    devicesValueStore.createTasks(Triggers.getReqiests());
    for await (let i of asyncGenerator()) {
      console.log(i);//сюда попадаю когда данные прочитаны
      const values: Set<IEvent> = doTriggers(data, Triggers);
      await DBWritter.write(values)
    }
  } catch (e) {
    console.log(e)
  }
  console.log('event-logger-service stoped')
}

main()
