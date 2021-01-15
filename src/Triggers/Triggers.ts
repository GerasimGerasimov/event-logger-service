import TDevicesPositionSource from "../DevicesSource/TDevicesPositionSource";
import TEventsSource from "../EventsSource/TEventsSource";
import { TTriggersTemplate } from "./Group/TriggersTemplate";
import { TTrigger } from "./Trigger/TTrigger";
import { ITriggerCellResult } from "./TriggerCell/iTreggerCell";

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

  public fillArgs(data: any) {
    this.triggers.forEach(trigger => {
      trigger.fillArgs(data);
    })
  }
  
  public getTriggersEvent(): Set<ITriggerCellResult>{
    const res:Set<ITriggerCellResult> = new Set()
    this.triggers.forEach(trigger => {
      const event: ITriggerCellResult | undefined = trigger.getTriggerEvent();
      if (event !== undefined) {
        res.add(event)
      }
    })
    return res;
  }
}
