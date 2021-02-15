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

async function main() {
  try {
    await devicesInfoStore.getDevicesInfo();
    devicesValueStore.createTasks(Triggers.getReqiests());
    for await (let i of devicesValueStore.asyncGenerator()) {
      console.log(i);//сюда попадаю когда данные прочитаны
      const values: Set<IEvent> = doTriggers(Triggers);
      await DBWritter.write(values)
    }
  } catch (e) {
    console.log(e)
  }
  console.log('event-logger-service stoped')
}

main()
