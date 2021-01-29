console.log('event-logger-service started');
import { TDBWritter } from './db/dbwritter';
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './http/server/httpserver';
import { IEvent } from './interfaces/iDBEvent';
import { validation } from './Test/controller';
import { dataset } from './Test/dataset';
import { doTriggers } from './Test/deviceparser';
import {TTriggersTemplate, createTemplateOfTriggersGroup } from './Triggers/Group/TriggersTemplate';
import { TTriggers } from './Triggers/Triggers';

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
const data = validation(dataset);

async function main(){
    await DBWritter.write(doTriggers(data, Triggers))
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '0';
    await DBWritter.write(doTriggers(data, Triggers))
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '1';
    await DBWritter.write(doTriggers(data, Triggers))
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '0';
    await DBWritter.write(doTriggers(data, Triggers))
    data.U1['U1:RAM'].data['DIN.2(C2_AC)'] = '1';
    await DBWritter.write(doTriggers(data, Triggers))
}

main()

let i = 1;
function func(i: number) {
  console.log(i)
}

setTimeout(function run () {
  func(i++);
  setTimeout(run, 1000);
}, 100);

console.log('event-logger-service stoped')
