console.log('event-logger-service started');
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './server/httpserver';
import { createTemplateOfTriggersGroup, setValuesToTriggers } from './Triggers/Triggers';

//const Server: HttpServer = new HttpServer();
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
createTemplateOfTriggersGroup(EventsSource);

setValuesToTriggers();

console.log('event-logger-service stoped')