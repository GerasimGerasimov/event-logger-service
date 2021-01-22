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

export const EventScheme = `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      type TEXT,
      trig TEXT,
      tag TEXT,
      details TEXT`