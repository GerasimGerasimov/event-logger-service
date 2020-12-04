//"рождается" после первого прогона файла конфигурации
//все триггеры и условия их срабатывания для каждого типа устройств описаны в типа icm.json файлах
import { getArrFromDelimitedStr } from "../../helpers/utils";
import { ITagInfo, ITriggerSource } from "../iTriggers";
import { TTriggerProps } from "./TTriggerProps";

//надо их распарсить
export default class TTriggerTemplate {
  private args: Map<string, ITagInfo> = new Map();
  private triggerProps: TTriggerProps;

  constructor(source: ITriggerSource){
    this.args = this.createTags(source.tags || new Map());
    this.triggerProps = new TTriggerProps(source.trigger, Array.from(this.args.keys()))
  }

  public get Args():Map<string, ITagInfo> {
    return this.args;
  }

  public get TriggerProps(): TTriggerProps {
    return this.triggerProps;
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

}
