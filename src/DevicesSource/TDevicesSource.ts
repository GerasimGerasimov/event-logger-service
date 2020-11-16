import * as Utils from '../helpers/utils';

const DevicesSourceDir: string = Utils.getAbsDirPath('');
const configFile: string = 'config.json'

export default class TDevicesSource {
  constructor () {
    Utils.validateFolderExistence(DevicesSourceDir);
    /*
    let EventsFilesList: Array<string> =  Utils.getFilesList(EventsSourceDir);
    let EventsFilesProps:Array<Utils.IDirСontents> = Utils.getFilesProps(EventsSourceDir, EventsFilesList);
    this.TagsInEvents = this.getTagsInEvents(EventsFilesProps);
    */
  }
}