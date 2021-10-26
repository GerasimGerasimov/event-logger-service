import * as Utils from '../helpers/utils';

const DevicesSourceDir: string = Utils.getAbsDirPath('');
const configFile: string = 'config.json'

export function get_db_path(): string {
  Utils.validateFolderExistence(DevicesSourceDir);
  const path: string = Utils.getJSONFromFile(DevicesSourceDir, 'config.json').path || '';
  if (!path) {throw new Error('Path to DB is not found')} 
  return path;
}

export function get_http_port(): number {
  Utils.validateFolderExistence(DevicesSourceDir);
  const port: number = Utils.getJSONFromFile(DevicesSourceDir, 'config.json').port || 5004;
  //if (!port) {throw new Error('Path to DB is not found')} 
  return port;
}

export function get_source_url(): string {
  Utils.validateFolderExistence(DevicesSourceDir);
  const sourceURL: string = Utils.getJSONFromFile(DevicesSourceDir, 'config.json').SourceURL || 'http://localhost:5004/';
  return sourceURL;
}