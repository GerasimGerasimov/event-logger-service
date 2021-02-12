import { TTriggers } from "../Triggers/Triggers";
import { IEvent } from "../interfaces/iDBEvent";
import { ITagAddress } from "./ITagAddress";
import { devicesInfoStore } from "../http/client/devicesinfo";


export function doTriggers(data: any, Triggers: TTriggers): Set<IEvent> {
  Triggers.fillArgs(data);
  const res: Set<IEvent> = Triggers.getTriggersEvent();
  return res;
}

//отдаёт значение по тегу U1/RAM/Iexc
export function getTagValue( tagAddr: ITagAddress, data: any): number | undefined {
  const {position, section, tag} = {...tagAddr}
  const TagAddr: string = `${position}/${section}/${tag}`;
  const value: string | undefined = devicesInfoStore.getTagValue(TagAddr)
  return (value != '')
    ? Number(value)
    : undefined;
}