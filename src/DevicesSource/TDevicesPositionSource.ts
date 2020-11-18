import * as Utils from '../helpers/utils';

const DevicesSourceDir: string = Utils.getAbsDirPath('');
const configFile: string = 'config.json'

interface IConfigGroup {
  devices: Array<string>;
  source: string;
}

interface IConfig {
  groups: Map<string, IConfigGroup>
}

export default class TDevicesPositionSource {
  
  private EventsInDevs: Map<string, string> = new Map();
  
  constructor () {
    Utils.validateFolderExistence(DevicesSourceDir);
    const groups: IConfig = Utils.getJSONFromFile(DevicesSourceDir, 'config.json').groups || {};
    this.EventsInDevs = this.createEventsInDevs(groups);
  }

  public getDevSource(dev: string): string | Error {
    const src: string = this.EventsInDevs.get(dev);
    if (src) return src;
    throw new Error (`Source for ${dev} not found`)
  }

  private createEventsInDevs(groups: IConfig): Map<string, string> {
    const res: Map<string, string> = new Map();
    for (const key in groups) {
      const group: IConfigGroup = groups[key];
      const source: string = group.source || '';
      const devices: Array<string> = group.devices || []
      if (source) {
        devices.forEach(dev => {
          res.set(dev, source)
        })
      }
    }
    return res;
  }
}