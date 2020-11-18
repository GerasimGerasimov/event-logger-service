export interface IEventDescription {
  comment:{};
  detail:{}
  /*
  "comment":{
    "ru":"Нет исправных регуляторов"
  },
  "detail":{
    "ru":""
  }*/
}

export interface ITriggerSource {
  tags:Map<string, string>;
  eventType: string,
  condition: Array<string>,
  description:IEventDescription;
}