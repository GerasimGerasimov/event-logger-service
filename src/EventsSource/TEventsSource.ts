import { IDeviceTriggersSource, IEventsSource, ITriggerSource } from '../Triggers/iTriggers';
import * as Utils from '../helpers/utils';

const EventsSourceDir: string = Utils.getAbsDirPath('events');

export default class TEventsSource {

  private Devices: Array<string> = [];
  private TagsInEvents:Map<string, Array<string>> = new Map();//содержит все теги чтобы собрать запрос к устройству
  private Triggers: Map<string, Array<IDeviceTriggersSource>> = new Map(); //сырые данные триггеров
  
  constructor () {
    Utils.validateFolderExistence(EventsSourceDir);
    let EventsFilesList: Array<string> =  Utils.getFilesList(EventsSourceDir);
    this.Devices = EventsFilesList;
    let EventsFilesProps:Array<Utils.IDirСontents> = Utils.getFilesProps(EventsSourceDir, EventsFilesList);
    this.TagsInEvents = this.getTagsInEvents(EventsFilesProps);
    this.Triggers = this.getTriggersMap(EventsFilesProps)
  }

  public get getAvalibleDevices(): Array<string> {
    return this.Devices;
  }


  public get getAvalibleTriggers(): Map<string, Array<IDeviceTriggersSource>> {
    return this.Triggers;
  }

  public getTriggersSource(src: string): Array<IDeviceTriggersSource> | Error {
    const triggers: Array<IDeviceTriggersSource> = this.Triggers.get(src);
    if (triggers) {
      return triggers;
    } else {
      throw new Error (`Triggers at ${src} not found`);
    }
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

  private getTriggersMap(files:Array<Utils.IDirСontents>): Map<string, Array<IDeviceTriggersSource>> {
    const res: Map<string, Array<IDeviceTriggersSource>> = new Map();
    files.forEach( value => {
      const { Content, FileName} = {... value};
      const content: Array<IDeviceTriggersSource> = JSON.parse(Content).events || [];
      res.set(FileName, content) 
    })
    return res;
  }

  private getTagsArrayFromContent(Content: any): Array<string> {
    const res: Array<string> = [];
    const tagsSet: Set<string> = new Set();
    const events:IEventsSource = JSON.parse(Content).events || [];
    //получаю в tagSet все не повторяющиеся теги для данного устройства
    for (const item in events) {
      const value:ITriggerSource = events[item];
      const tags: Array<string> = this.getTagsFromEventSource(value.tags);
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
