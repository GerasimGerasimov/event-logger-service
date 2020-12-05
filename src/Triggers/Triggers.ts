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
  private triggers: Array<TTrigger> = [];//array of TTrigger

  constructor(props: ICreateTriggersProps){
    this.triggers = this.createTriggersOfDevicesFromTemplates({...props});
  }

  private createTriggersOfDevicesFromTemplates(props: ICreateTriggersProps): Array<TTrigger> {
    const triggers: Array<TTrigger> = [];
    //templates = Map<'*.json', Set<TTriggerTemplate>} 
    //events    = Devices<Array> = ['icm.json',...]
    //positions = EventsInDevs<Map<position, *.json> = <'U1', 'icm.json'>
    for (const [position, source] of props.positions.EventsInDevs.entries()) {
      const TriggersTepltate: TTriggersTemplate = props.templates.get(source);
      TriggersTepltate.Triggers.forEach(triggerTemplate => {
        const trigger: TTrigger = new TTrigger(position, triggerTemplate);
        /*TODO заполнить данными создаваемые триггеры*/
        triggers.push(trigger);
      })
    }
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