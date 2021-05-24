import { IEvent } from "../db/iDBEvent";
import TDevicesPositionSource from "../DevicesSource/TDevicesPositionSource";
import TEventsSource from "../EventsSource/TEventsSource";
import { TTriggersTemplate } from "./Group/TriggersTemplate";
import { TTrigger } from "./Trigger/TTrigger";

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
    for (const [position, source] of props.positions.EventsInDevs.entries()) {
      const TriggersTepltate: TTriggersTemplate = props.templates.get(source);
      TriggersTepltate.Triggers.forEach(triggerTemplate => {
        const trigger: TTrigger = new TTrigger(position, triggerTemplate);
        triggers.push(trigger);
      })
    }
    return triggers;
  }

  public fillArgs() {
    this.triggers.forEach(trigger => {
      trigger.fillArgs();
    })
  }
  
  public getTriggersEvent(): Set<IEvent>{
    const res:Set<IEvent> = new Set()
    this.triggers.forEach(trigger => {
      const event: IEvent | undefined = trigger.getTriggerEvent();
      if (event !== undefined) {
        res.add(event)
      }
    })
    if (res.size) {
      console.log(res)
    }
    return res;
  }

  //"U1":{
  //  "RAM":["Usgz","DEX_STATE"],
  //[ {"U1":{"RAM":"ALL"}}, {"U2":{"FLASH":"ALL"}}
  public getRequests(): Array<any> {
    let req: Map<string, Map<string, Set<string>>> = new Map();
    this.triggers.forEach( (trigger: TTrigger) => {
      req = trigger.getRequest(req)
    })
    return this.convertMapRequestToReqObject(req)
  }

  //на вход получаю мап, на выходе должен быть массив объектов запросов
  //элемент ов в массиве стоклько сколько position и секций в нём
  private convertMapRequestToReqObject(src: Map<string, Map<string, Set<string>>>): Array<any> {
    const res: Array<any> = []
    for (const [position, value] of src.entries()) {
      const req = {};
      console.log(position, value);
      for (const [section, tags] of value.entries()) {
        const args: Array<string> = [... tags]
        req[position] = {
          [section] : args
        }
        res.push(req)
      }
    }
    return res;
  }
}
