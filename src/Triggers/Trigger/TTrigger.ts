import { ITagAddress } from "../../Devices/ITagAddress";
import { IEvent } from "../../interfaces/iDBEvent";
import { ArgFactory, TArg } from "../Args/TArg";
import { IArgInfo } from "../iTriggers";
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

  public getTriggerEvent(): IEvent | undefined {
    //TODO установка состояния в зависимости от внешних условий
    try {
      this.isArgsValid();
      return this.getCellTrigEvent(this.args);
    } catch (e) {
      this.TriggerCell.setInitialState();
    }
    return undefined;
  }
  
  public isArgsValid(): void | Error {
    for (const [key, arg] of this.args.entries()) {
      if (arg.Value === undefined) {
        throw new Error (`${arg} tag:${arg.Tag} is undefined`)
      }
    }
  }

  private getCellTrigEvent(args: Map<string, TArg>): IEvent | undefined {
    return this.TriggerCell.getTrigEvent(args);
  }

  //[ {"U1":{"RAM":"ALL"}}, {"U2":{"FLASH":"ALL"}} ]
  public getRequest(src: Map<string, Map<string, Set<string>>>): Map<string, Map<string, Set<string>>> {
    let req: Map<string, Map<string, Set<string>>> = src;//new Map();
    this.args.forEach((arg:TArg) => {
      const tag: ITagAddress | undefined = arg.TagAddr;
      if (tag) {
        console.log(tag);
        req = this.fillReq(tag, req)
      }
    })
    return req
  }

  private fillReq(data: ITagAddress, src: Map<string, Map<string, Set<string>>>): Map<string, Map<string, Set<string>>> {
    const res: Map<string, Map<string, Set<string>>> = src;
    if (!res.has(data.position)) {
      res.set(data.position, new Map());
    }
    const position: Map<string, Set<string>> = res.get(data.position);
    if (!position.has(data.section)) {
      position.set(data.section, new Set())
    }
    const sectionTags: Set<string> = position.get(data.section);
    sectionTags.add(data.tag);
    position.set(data.section, sectionTags);
    res.set(data.position, position);
    return res;
  }
}