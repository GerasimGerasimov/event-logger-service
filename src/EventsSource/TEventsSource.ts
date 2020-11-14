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
    const events:IEventsSource = JSON.parse(Content);
    return res;
  }
}