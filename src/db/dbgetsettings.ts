import * as Utils from '../helpers/utils';

const DevicesSourceDir: string = Utils.getAbsDirPath('');
const configFile: string = 'config.json'

export function getDBPath(): string {
  Utils.validateFolderExistence(DevicesSourceDir);
  const path: string = Utils.getJSONFromFile(DevicesSourceDir, 'config.json').path || '';
  if (!path) {throw new Error('Path to DB is not found')} 
  return path;
}