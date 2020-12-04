import { ITagInfo } from "../iTriggers";
import { TTriggerProps } from "./TTriggerProps";
import TTriggerTemplate from "./TTriggerTemplate";

enum eTriggerState {
  WaitValidValues,
  WaitSet,
  WaitReset
}

export class TTrigger {
  private args: Map<string, ITagInfo> = new Map();
  private triggerProps: TTriggerProps;
  
  private current:   number = undefined;
  private previous:  number = undefined;
  private state: eTriggerState = eTriggerState.WaitValidValues;


  constructor(position: string, template: TTriggerTemplate){
    this.args = new Map(template.Args);//копирую через new. чтобы создался новый экземпляр а не ссылка
    this.triggerProps = template.TriggerProps;
    console.log(this.triggerProps);
  }

  public getTagsValuesFromRespond(){
    this.isTagsValuesValid()
  }

  private isTagsValuesValid(): void | Error{
    for (const [key, value] of this.args.entries()){
      console.log(key, value)
    }
  }
  
}