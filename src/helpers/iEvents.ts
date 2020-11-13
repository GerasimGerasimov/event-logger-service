export interface IEvent {
  date: string;
  type: string;
  tag: string;
  details: {
    initialValue: string;
    comment: string;
    todo: string;
  }
}
