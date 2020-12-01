import { ITriggerSource } from "../iTriggers";
import TTriggerTemplate from "../Trigger/TTriggerTemplate";

export default class TTriggersTemplate {

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