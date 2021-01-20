import { TTriggers } from "../Triggers/Triggers";
import { getArrFromDelimitedStr } from "../helpers/utils";
import { ITriggerCellResult } from "../Triggers/TriggerCell/iTreggerCell";

class TPositionAndSection {
  position: string = '';
  section: string = ''
}

export function doTriggers(data: any, Triggers: TTriggers) {
  Triggers.fillArgs(data);
  const res: Set<ITriggerCellResult> = Triggers.getTriggersEvent();
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