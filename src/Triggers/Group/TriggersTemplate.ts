
import TEventsSource from "../../EventsSource/TEventsSource";
import { ITriggerSource } from "../iTriggers";
import TTriggerTemplate from "../Trigger/TTriggerTemplate";

export class TTriggersTemplate {

  private triggers: Set<TTriggerTemplate> = new Set();

  constructor(triggers: Array<ITriggerSource>) {
    triggers.forEach(item=>{
      const trigger: TTriggerTemplate = new TTriggerTemplate(item);
      this.triggers.add(trigger);
    })
  }
  
  public get Triggers(): Set<TTriggerTemplate> {
    return this.triggers
  }
}

export function createTemplateOfTriggersGroup(source: TEventsSource): Map<string, TTriggersTemplate> {
  const TriggersGroup: Map<string, TTriggersTemplate> = new Map();
  const TriggesSource: Map<string, Array<ITriggerSource>> = source.getAvalibleTriggers;
  for (const [dev, triggers] of TriggesSource ) {
    const TriggersTemplate: TTriggersTemplate = new TTriggersTemplate(triggers)
    TriggersGroup.set(dev, TriggersTemplate)
  }
  return TriggersGroup
}
