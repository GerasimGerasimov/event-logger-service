console.log('event-logger-service started');
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './server/httpserver';

const Server: HttpServer = new HttpServer();
const EventsSource: TEventsSource = new TEventsSource();

console.log(EventsSource.getTagsFormSource('icm.json'))

console.log('event-logger-service stoped')