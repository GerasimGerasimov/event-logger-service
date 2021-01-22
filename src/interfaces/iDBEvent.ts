export interface IEvent {
  date: string;
  type: string;
  trig: string;  
  tag: string;
  details: {
    initialValue: string;
    comment: string;
    todo: string;
  }
}