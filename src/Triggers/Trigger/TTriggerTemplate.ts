//"рождается" после первого прогона файла конфигурации
//все триггеры и условия их срабатывания для каждого типа устройств описаны в типа icm.json файлах

import { getArrFromDelimitedStr } from "../../helpers/utils";
import { ITriggerSource } from "../iTriggers";
import { TTriggerProps } from "./TTriggerProps";

enum eTriggerState {
  INIT,
  RUN
}

interface ITagInfo {
  tag: string;
  section: string;
  value: number;
}

//надо их распарсить
export default class TTriggerTemplate {
  private args: Map<string, ITagInfo> = new Map();
  private current:   number = undefined;
  private previous:  number = undefined;
  private state: eTriggerState = eTriggerState.INIT;
  private trigger: TTriggerProps;

  constructor(source: ITriggerSource){
    this.args = this.createTags(source.tags || new Map());
    this.trigger = new TTriggerProps(source.trigger, Array.from(this.args.keys()))
  }

  private createTags(tags: Map<string, string>): Map<string, ITagInfo> {
    const res: Map<string, ITagInfo> = new Map();
    for (const key in tags) {
      const arg: string = tags[key];
      const tagInfo: ITagInfo = {... this.parseTag(arg), value: undefined};
      console.log(tagInfo);
      res.set(key, tagInfo)
    }
    return res;
  }

  private parseTag(argTag: string): {section: string, tag: string} {
    const values: Array<string> = getArrFromDelimitedStr(argTag,'/');
    const section: string = values[0] || 'RAM';
    const tag: string = values[1] || '';
    return {section, tag}
  }

  public getTagsValuesFromRespond(){

  }
}
