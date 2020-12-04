import TDevicesPositionSource from "../DevicesSource/TDevicesPositionSource";
import TEventsSource from "../EventsSource/TEventsSource";
import { TTriggersTemplate } from "./Group/TriggersTemplate";
import { ITriggerSource} from "./iTriggers";
import { TTrigger } from "./Trigger/TTrigger";

/*TODO нужно создавать триггеры и привязывать их к устройствам
  U1: {triggers}
  },
  U2: {triggers}
  }

  или при создании триггера сообщать к какому Ux устройству он относится 
  и соответсвенно потом после прочтения всех данных формировать структуру
  {
    U1:{data},
    U2:{data}
  },
  потом делать цикл, всех триггеров по этой струкруре в поисках своих данных
  ... кажется более логичным

*/

interface ICreateTriggersProps {
  templates: Map<string, TTriggersTemplate>,
  events:TEventsSource,
  positions: TDevicesPositionSource
}

export class TTriggers {
  private triggers: Map<string, Array<TTrigger>> = new Map();//position like "U1",  array of TTrigger

  constructor(props: ICreateTriggersProps){
    this.triggers = this.createTriggersOfDevicesFromTemplates({...props});
  }

  private createTriggersOfDevicesFromTemplates(props: ICreateTriggersProps): Map<string, Array<TTrigger>> {
  const triggers: Map<string, Array<TTrigger>> = new Map()
  //templates = Map<'*.json', Set<TTriggerTemplate>} 
  //events    = Devices<Array> = ['icm.json',...]
  //positions = EventsInDevs<Map<position, *.json> = <'U1', 'icm.json'>
  for (const [position, source] of props.positions.EventsInDevs.entries()) {
    console.log(position, source);//'U1', 'icm.json'
    const TriggersTepltate: TTriggersTemplate = props.templates.get(source);
    console.log(TriggersTepltate)
    
    const ArrayOfTriggers: Array<TTrigger> = [];
    TriggersTepltate.Triggers.forEach(triggerTemplate => {
      console.log(triggerTemplate)
      const trigger: TTrigger = new TTrigger(position, triggerTemplate);
      /*TODO заполнить данными создаваемые триггеры*/
      ArrayOfTriggers.push(trigger);
    })
    triggers.set(position, ArrayOfTriggers)

  }
  console.log('createTriggersOfDeficesFromTemplates');
  return triggers;
}
}
/*
export function setValuesToTriggers(TriggersGroup: Map<string, TTrigger>){
  for (const TriggersTemplate of TriggersGroup.values()) {
    console.log(TriggersTemplate)
    for (const Trigger of TriggersTemplate.Triggers.values()) {
      console.log(Trigger)
      Trigger.getTagsValuesFromRespond();
    }
  }
}
*/