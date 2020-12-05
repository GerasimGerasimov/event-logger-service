//"рождается" после первого прогона файла конфигурации
//все триггеры и условия их срабатывания для каждого типа устройств описаны в типа icm.json файлах
import { getArrFromDelimitedStr } from "../../helpers/utils";
import { createArgsTemplates } from "../Args/ArgHelpers";
import { IArgInfo, ITriggerSource } from "../iTriggers";
import { TTriggerProps } from "./TTriggerProps";

//надо их распарсить
export default class TTriggerTemplate {
  private args: Map<string, IArgInfo> = new Map();
  private triggerProps: TTriggerProps;

  constructor(source: ITriggerSource){
    this.args = createArgsTemplates(source.tags || new Map());
    this.triggerProps = new TTriggerProps(source.trigger, Array.from(this.args.keys()))
  }

  public get Args():Map<string, IArgInfo> {
    return this.args;
  }

  public get TriggerProps(): TTriggerProps {
    return this.triggerProps;
  }

}
