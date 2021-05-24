console.log('event-logger-service started');

import { TDBWritter } from './db/dbwritter';
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { IEvent } from './db/iDBEvent';
import { doTriggers } from './Devices/deviceparser';
import {TTriggersTemplate, createTemplateOfTriggersGroup } from './Triggers/Group/TriggersTemplate';
import { TTriggers } from './Triggers/Triggers';
import { TDevicesValueStore } from './http/client/devices';
import { devicesInfoStore } from './http/client/devicesinfo';
import { delay} from './helpers/utils';
import { get_db_path, get_http_port } from './settings/settings';
import HttpServer from './http/server/server';
import WSServer from './ws/server/server';
import HostController from './ws/client/controller';
import DeviceController from './http/client/controllers/device';

/**работаю в ветке tagger-over-ws */

/**TODO неожиданно! прилитело событие, хотя никаких внешних воздействий
 * на параметры девайса не было! думаю когда будет прописано больше триггеров
 * прилетать будет чаше, что даст больше инфы для отладки.
 * date:'Apr 13 2021 10:56:28 GMT+0700'
    details:{initialValue: 'input: 1 >= setValue: 1', comment: 'гашение поля', todo: ''}
    tag:'U1/RAM/Blank'
    trig:'FRONT'
    type:'info'
    utime:1618286188556
 */

//const Server: HttpServer = new HttpServer();
const DBWritter = new TDBWritter(get_db_path());
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
const TriggersTemplates: Map<string, TTriggersTemplate> = createTemplateOfTriggersGroup(EventsSource);
const Triggers = new TTriggers({
    templates: TriggersTemplates,
      events: EventsSource,
        positions: DevicesPositionSource});

const devicesValueStore:TDevicesValueStore = new TDevicesValueStore();
const Server: HttpServer = new HttpServer(get_http_port());
const WSS: WSServer = new WSServer(Server.https, undefined);

const TaggerURL: string = 'http://localhost:5004/';

const Tagger: HostController = new HostController({host: TaggerURL});
DeviceController.init(Tagger);

/** как хотелось бы организовать код*/
(async () => { 
  while (true) {
    try {
      await Tagger.open();//открыть соединение и получить ClientID
      await devicesInfoStore.getDevicesInfo();//получить инфу об устройствах
      devicesValueStore.createTasks(Triggers.getRequests());//разбить на задачи для чтения
      while (true) {
        //TODO надо чтобы на переконнект с WS вываливался только если Fetch Error
        for await (let i of devicesValueStore.asyncGenerator()) {
          console.log(i);
          const written: boolean = await DBWritter.write(doTriggers(Triggers));
          if (written) {
            WSS.sendNotificationAfter(1000);
          }
        }
      }

    } catch (e) {
      console.log('главЛовушка',e);
      await delay(5000);//подождал 3 а потом закрыл соединение
      await Tagger.close();//закрыть соединение
      //devicesValueStore.clearTasks()
    }

  }
})();


/*
(async () => {
  try {
    await devicesInfoStore.getDevicesInfo();
    devicesValueStore.createTasks(Triggers.getReqiests());
    while (true) {
      try {
        for await (let i of devicesValueStore.asyncGenerator()) {
          //console.log(i);//сюда попадаю когда данные прочитаны
          const values: Set<IEvent> = doTriggers(Triggers);
          if (values.size != 0 ){
            await DBWritter.write(values);
            WSS.sendNotification();
          }
        }
      } catch (e) {
        console.log('inner:', e);
      }
      await delay(1000);
    }
  } catch (e) {
    console.log('extern:', e);
  }
  console.log('event-logger-service stoped')
})();
*/