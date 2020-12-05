import { ArgFactory, TArg } from "../Args/TArg";
import { IArgInfo } from "../iTriggers";
import { TTriggerProps } from "./TTriggerProps";
import TTriggerTemplate from "./TTriggerTemplate";

enum eTriggerState {
  WaitValidValues,
  WaitSet,
  WaitReset
}

export class TTrigger {
  //private args: Map<string, ITagInfo> = new Map();/*TODO добавиь fullTagName //U1/RAM/Ustat c учётом position*/
  private args: Map<string, TArg> = new Map();
  private triggerProps: TTriggerProps;
  private tag: string = '';
  private position: string = '';
  
  private current:   number = undefined;
  private previous:  number = undefined;
  private state: eTriggerState = eTriggerState.WaitValidValues;


  constructor(position: string, template: TTriggerTemplate){
    this.position = position;
    this.args = this.createArgs(position, template.Args);
    this.triggerProps = template.TriggerProps;
    console.log(this.triggerProps);
  }

  public createArgs(position: string, templates: Map<string, IArgInfo> ): Map<string, TArg> {
    const res: Map<string, TArg> = new Map();
    for (const [key, argTeplate] of templates.entries()) {
      const arg: TArg = ArgFactory(position, argTeplate);
      res.set(key, arg)
    }
    return res;
  }

  public setFullTag(position: string): string {
    /*
    const { tag, section } = {... this.triggerProps.
    this.tag = `${position}/${}/${}`
    */
   return '';
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