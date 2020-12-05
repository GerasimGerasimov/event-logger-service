import { getArrFromDelimitedStr } from "../../helpers/utils";
import { IArgInfo } from "../iTriggers";

export function createArgsTemplates(tags: Map<string, string>): Map<string, IArgInfo> {
  const res: Map<string, IArgInfo> = new Map();
  for (const key in tags) {
    const arg: string = tags[key];
    const tagInfo: IArgInfo = {... parseArgProps(arg)};
    console.log(tagInfo);
    res.set(key, tagInfo)
  }
  return res;
}

function parseArgProps(argTag: string): {section: string, tag: string, value: number} {
  const values: Array<string> = getArrFromDelimitedStr(argTag,'/');
  return (isArgIsConst(values))
    ? returnArgConstProps(values)
    : returnArgTagProps(values)
}

function isArgIsConst(values: Array<string>): boolean {
  return (values.length === 1)
    ? true
    : false
}

function returnArgTagProps(values: Array<string>): {section: string, tag: string, value: number} {
  return {
    section: values[0] || 'RAM',
    tag: values[1] || '',
    value: undefined
  }
}

function returnArgConstProps(values: Array<string>): {section: string, tag: string, value: number} {
  return {
    section: '',
    tag: '',
    value: Number(values[0]) || 1
  }
}