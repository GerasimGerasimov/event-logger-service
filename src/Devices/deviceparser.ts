import { TTriggers } from "../Triggers/Triggers";
import { getArrFromDelimitedStr } from "../helpers/utils";
import { IEvent } from "../interfaces/iDBEvent";
import { ITagAddress } from "./ITagAddress";


class TPositionAndSection {
  position: string = '';
  section: string = ''
}

export function doTriggers(data: any, Triggers: TTriggers): Set<IEvent> {
  Triggers.fillArgs(data);
  const res: Set<IEvent> = Triggers.getTriggersEvent();
  return res;
}

//отдаёт значение по тегу U1/RAM/Iexc
export function getTagValue( tagAddr: ITagAddress, data: any): number | undefined {
  const {position, section, tag} = {...tagAddr}
  const SectionAtPosition: string = `${position}:${section}`;
  const value: number | undefined = 
        (data[position]) 
          ? (data[position][SectionAtPosition])
            ? (data[position][SectionAtPosition].data[tag])
              ? Number(data[position][SectionAtPosition].data[tag])
              : undefined
            : undefined
          : undefined
  return value;
}


function getPositionAndSection(slot: string): TPositionAndSection {
  const [position, section] = getArrFromDelimitedStr(slot,':');
  return {position, section}
}