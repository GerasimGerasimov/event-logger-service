import TEventsSource from "../EventsSource/TEventsSource";
import TTriggersTemplate from "./Group/TriggersTemplate";
import { ITriggerSource} from "./iTriggers";

export function createTemplateOfTriggersGroup(source: TEventsSource): Map<string, TTriggersTemplate> {
  const TriggersGroup: Map<string, TTriggersTemplate> = new Map();
  const TriggesSource: Map<string, Array<ITriggerSource>> = source.getAvalibleTriggers;
  for (const [dev, triggers] of TriggesSource ) {
    const TriggersTemplate: TTriggersTemplate = new TTriggersTemplate(triggers)
    TriggersGroup.set(dev, TriggersTemplate)
  }
  return TriggersGroup
}

export function setValuesToTriggers(TriggersGroup: Map<string, TTriggersTemplate>){
  for (const TriggersTemplate of TriggersGroup.values()) {
    console.log(TriggersTemplate)
    for (const Trigger of TriggersTemplate.Triggers.values()) {
      console.log(Trigger)
      Trigger.getTagsValuesFromRespond();
    }
  }
}