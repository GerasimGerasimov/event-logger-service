import { TTriggers } from "../Triggers/Triggers";
import { getArrFromDelimitedStr } from "../helpers/utils";

class TPositionAndSection {
  position: string = '';
  section: string = ''
}

export function fillTriggersTagsValues(data: any, Triggers: TTriggers) {
  Triggers.update(data);
}

export interface ITagAddress {
  position: string;
  section: string;
  tag: string;
}
//отдаёт значение по тегу U1/RAM/Iexc
export function getTagValue( tagAddr: ITagAddress, data: any): number | undefined {
  const {position, section, tag} = {...tagAddr}
  const SectionAtPosition: string = `${position}:${section}`;
  const value: string = data[position][SectionAtPosition].data[tag] || undefined ;
  return Number(value);
}


function getPositionAndSection(slot: string): TPositionAndSection {
  const [position, section] = getArrFromDelimitedStr(slot,':');
  return {position, section}
}