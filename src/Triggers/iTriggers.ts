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

export interface IArgInfo {
  tag: string; //Ustat
  section: string; //RAM
  value: number;
}

export enum  ETriggerType {
  'FRONT',
  'REAR',
  'TOUGLE'
}

export interface ITriggerDesctripion {
  type: ETriggerType;
  setCondition: string,
  resetCondition: string,
  tolerance: string;
}
export interface ITriggerSource {
  tags:Map<string, string>;
  eventType: string,
  trigger: ITriggerDesctripion,
  description:IEventDescription;
}

export interface IEventsSource {
  events: Array<ITriggerSource>
}
