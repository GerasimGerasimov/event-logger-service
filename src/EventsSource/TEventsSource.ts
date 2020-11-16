import * as Utils from '../helpers/utils';

const EventsSourceDir: string = Utils.getAbsDirPath('events');

interface IEventDescription {
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

interface IEventSource {
  tags:Map<string, string>;
  eventType: string,
  condition: Array<string>,
  description:IEventDescription;
}

interface IEventsSource {
  events: Array<IEventSource>
}

export default class TEventsSource {

  private TagsInEvents:Map<string, Array<string>> = new Map();

  constructor () {
    Utils.validateFolderExistence(EventsSourceDir);
    let EventsFilesList: Array<string> =  Utils.getFilesList(EventsSourceDir);
    let EventsFilesProps:Array<Utils.IDirСontents> = Utils.getFilesProps(EventsSourceDir, EventsFilesList);
    this.TagsInEvents = this.getTagsInEvents(EventsFilesProps);
  }

  public getTagsFormSource(src: string): Array<string> | Error {
    const tags: Array<string> = this.TagsInEvents.get(src);
    if (tags) {
      return tags;
    } else {
      throw new Error (`Events file ${src} not found`);
    }
  }

  private getTagsInEvents(files:Array<Utils.IDirСontents>):Map<string, Array<string>> {
    const res:Map<string, Array<string>> = new Map();
    files.forEach(value => {
      const {Content, FileName} = {... value};
      const Tags: Array<string> = this.getTagsArrayFromContent(Content);
      res.set(FileName, Tags);
    })
    return res;
  }

  private getTagsArrayFromContent(Content: any): Array<string> {
    const res: Array<string> = [];
    const tagsSet: Set<string> = new Set();
    const events:IEventsSource = JSON.parse(Content).events || [];
    //получаю в tagSet все не повторяющиеся теги для данного устройства
    for (const item in events) {
      const value:IEventSource = events[item];
      const tags: Array<string> = this. getTagsFromEventSource(value.tags);
      tags.forEach(tag => tagsSet.add(tag))
    }
    //преобразую карту в массив
    Array.from([... tagsSet], value => res.push(value))
    return res;
  }

  private getTagsFromEventSource(tagsMap:Map<string, string>): Array<string> {
    const res: Array<string> = [];
    for (const key in tagsMap) {
      const tag: string = tagsMap[key];
      res.push(tag);
    }
    return res;
  }
}
