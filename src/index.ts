console.log('event-logger-service started');
import TDevicesPositionSource from './DevicesSource/TDevicesPositionSource';
import TEventsSource from './EventsSource/TEventsSource';
import { HttpServer } from './server/httpserver';
import { validation } from './Test/controller';
import { dataset } from './Test/dataset';
import { fillTriggersTagsValues } from './Test/deviceparser';
import TTriggersTemplate from './Triggers/Group/TriggersTemplate';
import { TTrigger } from './Triggers/Trigger/TTrigger';
import { createTemplateOfTriggersGroup, setValuesToTriggers } from './Triggers/Triggers';

//const Server: HttpServer = new HttpServer();
const EventsSource = new TEventsSource();
const DevicesPositionSource = new TDevicesPositionSource()
const TriggersGroup: Map<string, TTriggersTemplate> = createTemplateOfTriggersGroup(EventsSource);
/*TODO шаблоны триггеров подготовлены, наверно надо теперь сделать сами триггеры
в которые будут интегрированы шаблоны*/
const Triggers: Map<string, Array<TTrigger>> = createTriggersOfDeficesFromTemplates(
                        TriggersGroup,
                          EventsSource,
                            DevicesPositionSource);
const data = validation(dataset);//data = U1:{U1:RAM{...}}
fillTriggersTagsValues(data);
//setValuesToTriggers(TriggersGroup);

console.log('event-logger-service stoped')

function createTriggersOfDeficesFromTemplates(
    triggersTepltate: Map<string, TTriggersTemplate>,
    eventsSource:TEventsSource,
    devToPosition: TDevicesPositionSource): Map<string, Array<TTrigger>> {
  const triggers: Map<string, Array<TTrigger>> = new Map()
  //triggersTepltate Map<'*.json', Set<TTriggerTemplate>} 
  //eventsSource содержит Devices<Array> = ['icm.json',...]
  //devToSource coдержит EventsInDevs<Map<position, *.json> = <'U1', 'icm.json'>
  for (const [position, source] of devToPosition.EventsInDevs.entries()) {
    console.log(position, source);//'U1', 'icm.json'
    const TriggersTepltate: TTriggersTemplate = triggersTepltate.get(source);
    console.log(TriggersTepltate)
    
    const ArrayOfTriggers: Array<TTrigger> = [];
    TriggersTepltate.Triggers.forEach(triggerTemplate => {
      console.log(triggerTemplate)
      const trigger: TTrigger = new TTrigger();
      ArrayOfTriggers.push(trigger);
    })
    triggers.set(position, ArrayOfTriggers)

  }
  console.log('createTriggersOfDeficesFromTemplates');
  return triggers;
}