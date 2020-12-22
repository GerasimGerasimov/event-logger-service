import { ArgFactory, TArg } from "../Args/TArg";
import { IArgInfo } from "../iTriggers";
import { ITriggerCellResult } from "../TriggerCell/iTreggerCell";
import { TriggerCellFactory } from "../TriggerCell/TriggerCell";
import { TTriggerCell } from "../TriggerCell/TTriggerCell";
import TTriggerTemplate from "./TTriggerTemplate";

export class TTrigger {
  private args: Map<string, TArg> = new Map();
  private TriggerCell: TTriggerCell;

  constructor(position: string, template: TTriggerTemplate){
    this.args = this.createArgs(position, template.Args);
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
      this.updateCell(this.args);
    } catch (e) {
      this.TriggerCell.setInitialState();
    }
  }
  
  private isArgsValid(): void | Error {
    for (const [key, arg] of this.args.entries()) {
      if (arg.Value === undefined) {
        throw new Error (`${arg} tag:${arg.Tag} is undefined`)
      }
    }
  }

  private updateCell(args: Map<string, TArg>): ITriggerCellResult | Error {
    return this.TriggerCell.update(args);
  }

}