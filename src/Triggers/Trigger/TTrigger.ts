import { ArgFactory, TArg } from "../Args/TArg";
import { IArgInfo } from "../iTriggers";
import { TriggerCellFactory } from "../TriggerCell/TriggerCell";
import { TTriggerCell } from "../TriggerCell/TTriggerCell";
import { TTriggerProps } from "./TTriggerProps";
import TTriggerTemplate from "./TTriggerTemplate";

enum eTriggerState {
  WaitValidValues,
  WaitSet,
  WaitReset
}

export class TTrigger {
  private args: Map<string, TArg> = new Map();
  private TriggerCell: TTriggerCell;
  private triggerProps: TTriggerProps;
  
  private current:   number = undefined;
  private previous:  number = undefined;
  private state: eTriggerState = eTriggerState.WaitValidValues;

  constructor(position: string, template: TTriggerTemplate){
    this.args = this.createArgs(position, template.Args);
    this.triggerProps = template.TriggerProps;
    this.TriggerCell = TriggerCellFactory(template.TriggerProps)
  }

  public createArgs(position: string, templates: Map<string, IArgInfo> ): Map<string, TArg> {
    const res: Map<string, TArg> = new Map();
    for (const [key, argTeplate] of templates.entries()) {
      const arg: TArg = ArgFactory(position, argTeplate);
      res.set(key, arg)
    }
    return res;
  }

  public fillArgs(data: any) {
    this.args.forEach(arg => {
      arg.setValue(data);
    })
  }

  public update(){
    //TODO установка состояния в зависимости от внешних условий
    try {
      this.isArgsValid();
      this.checkTrigState();
    } catch (e) {
      this.setTriggerState(eTriggerState.WaitValidValues)
    }
  }
  
  private isArgsValid(): void | Error {
    for (const [key, arg] of this.args.entries()) {
      if (arg.Value === undefined) {
        throw new Error (`${arg} tag:${arg.Tag} is undefined`)
      }
    }
  }

  private checkTrigState(){
    /*TODO
    1) если триггер в WaitValidValues то (раз сюда попали значит они Валидны)
       то надо "предзарядить" триггер на основании текущих значений аргументов
       чтобы небыло ложного срабатывания. После этого действия, состояние
       установится либо в WaitSet либо в WaitReset
    2) Устаналивать противоположенное состение в зависимости от условий WaitSet либо в WaitReset
    */
   switch (this.state) {
     case eTriggerState.WaitValidValues:
      this.setInitialTrigState();
      break;
     case eTriggerState.WaitReset: break;
     case eTriggerState.WaitSet: break;
   }
  }

  private setInitialTrigState() {

  }

  private setTriggerState(newState: eTriggerState) {
    this.state = newState;
  }
}