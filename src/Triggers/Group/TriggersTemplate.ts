import { IDeviceTriggersSource } from "../iTriggers";

export default class TTriggersTemplate {

  private groups: Map<string, any> = new Map();

  constructor(Triggers: Map<string, Array<IDeviceTriggersSource>>) {
    const key = Array.from(Triggers.keys());
    /*
    devs.forEach(item=>{
      this.groups.set(item,{})
    })
    */
  }
  
}