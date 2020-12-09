console.log('event-logger-service started');
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './server/httpserver';
import { validation } from './Test/controller';
import { dataset } from './Test/dataset';
import { fillTriggersTagsValues } from './Test/deviceparser';
import {TTriggersTemplate, createTemplateOfTriggersGroup } from './Triggers/Group/TriggersTemplate';
import { TTriggers } from './Triggers/Triggers';

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
fillTriggersTagsValues(data, Triggers);

//setValuesToTriggers(data, Triggers);

console.log('event-logger-service stoped')
