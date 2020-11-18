console.log('event-logger-service started');
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './server/httpserver';
import { createTemplateOfTriggersGroup } from './Triggers/Triggers';

//const Server: HttpServer = new HttpServer();
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
createTemplateOfTriggersGroup(EventsSource);

console.log('event-logger-service stoped')