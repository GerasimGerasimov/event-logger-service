export interface IEvent {
  utime: number;// время в мс для быстрого поиска по числам, а не по тексту
  date: string; // время в человекочитаемом формате Feb 15 2021 23:55:03 GMT+0700
  type: string; // alarm/info/warning
  trig: string; // FRONT/REAR/TOUGLE
  tag: string;  // U1/RAM/Blank
  details: {    //JSON {"initialValue":"input: 1 >= setValue: 1","comment":"гашение поля","todo":""}
    initialValue: string;//значение входа и условие срабатывания в момент генерации события
    comment: string;//текстовое описание события (что произошло)
    todo: string; //рекомендация ЧТО ДЕЛАТЬ при возникновении события
  }
}