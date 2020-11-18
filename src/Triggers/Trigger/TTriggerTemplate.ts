//"рождается" после первого прогона файла конфигурации
//все триггеры и условия их срабатывания для каждого типа устройств описаны в типа icm.json файлах

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
  private tags: Array<ITagInfo> = [];
  private current:   number = 0;
  private previous:  number = 0;
  private state: eTriggerState = eTriggerState.INIT;
  private trigCondition: Array<any> = []

  constructor(source: ITriggerSource){
    console.log(source)
    this.tags = this.createTags(source.tags);
  }

  private createTags(tags: Array<string>): Array<ITagInfo> {
    const res: Array<ITagInfo> = [];

    return res;
  }

  public getTagsValuesFromRespond(){

  }

  private onTrig() {

  }

  private setNextTrigValue(){

  }
}