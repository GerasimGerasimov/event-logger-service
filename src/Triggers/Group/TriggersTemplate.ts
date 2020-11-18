import { ITriggerSource } from "../iTriggers";
import TTriggerTemplate from "../Trigger/TTriggerTemplate";

export default class TTriggersTemplate {

  private Triggers: Set<TTriggerTemplate> = new Set();

  constructor(triggers: Array<ITriggerSource>) {
    triggers.forEach(item=>{
      const trigger: TTriggerTemplate = new TTriggerTemplate(item);
      this.Triggers.add(trigger);
    })
  }
  
}