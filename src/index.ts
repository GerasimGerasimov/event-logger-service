console.log('event-logger-service started');
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './server/httpserver';

const Server: HttpServer = new HttpServer();
const EventsSource: TEventsSource = new TEventsSource();

function main(){

}

main()
console.log('event-logger-service stoped')