import TEventsSource from "../EventsSource/TEventsSource";
import TTriggersTemplate from "./Group/TriggersTemplate";
import { ITriggerSource} from "./iTriggers";

const TriggersGroup: Map<string, TTriggersTemplate> = new Map();

export function createTemplateOfTriggersGroup(source: TEventsSource) {
  const TriggesSource: Map<string, Array<ITriggerSource>> = source.getAvalibleTriggers;
  for (const [dev, triggers] of TriggesSource ) {
    const TriggersTemplate: TTriggersTemplate = new TTriggersTemplate(triggers)
    TriggersGroup.set(dev, TriggersTemplate)
  }
}