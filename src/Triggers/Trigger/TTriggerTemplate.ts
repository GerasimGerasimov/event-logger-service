//"рождается" после первого прогона файла конфигурации
//все триггеры и условия их срабатывания для каждого типа устройств описаны в типа icm.json файлах

import { getArrFromDelimitedStr } from "../../helpers/utils";
import { ITriggerSource } from "../iTriggers";

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
  private trigCondition: Array<any> = [];

  constructor(source: ITriggerSource){
    this.args = this.createTags(source.tags || new Map());
    this.trigCondition = this.createConditions(source.condition || []);
  }

  //TODO выбор условия проверки condition (так как проверок может быть несколько)
  
  private createConditions(conditions: Array<string>): Array<any> {
    //сформировать строку из названий args и условия
    //let func = new Function([arg1, arg2, ...argN], functionBody)
    const res: Array<any> = [];
    const args:Array<string> = Array.from(this.args.keys());
    conditions.forEach(item=>{
      let body: string  = `return ${item}`;
      let func = new Function(args.join( ), body);
      console.log(func(2,5))
      res.push(func);
    })
    return res;
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

  private onTrig() {

  }

  private setNextTrigValue(){

  }
}