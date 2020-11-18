//"рождается" после первого прогона файла конфигурации
//все триггеры и условия их срабатывания для каждого типа устройств описаны в типа icm.json файлах

import { ITriggerSource } from "../iTriggers";

//надо их распарсить
export default class TTriggerTemplate {
  private state: number = 0;
  private pred:  number = 0;
  constructor(source: ITriggerSource){
    console.log(source)
  }
}