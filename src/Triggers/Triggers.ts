import TEventsSource from "../EventsSource/TEventsSource";
import TTriggersTemplate from "./Group/TriggersTemplate";
import { IDeviceTriggersSource } from "./iTriggers";

var TriggersGroup: TTriggersTemplate;

export function createTemplateOfTriggersGroup(source: TEventsSource) {
  const TriggesSource: Map<string, Array<IDeviceTriggersSource>> = source.getAvalibleTriggers;
  TriggersGroup = new TTriggersTemplate(TriggesSource);
}