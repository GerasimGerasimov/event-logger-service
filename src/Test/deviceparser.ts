import { getArrFromDelimitedStr } from "../helpers/utils";

class TPositionAndSection {
  position: string = '';
  section: string = ''
}

export function fillTriggersTagsValues(data: any) {
  for (const pos in data) {
    const value = data[pos];//{U1:RAM {status, time, data{tag:value, ...}}}
    for (const slotName in value) {
      const {position, section} = getPositionAndSection(slotName);//U1:RAM
      console.log(position, section)//position U1, section RAM
    }
    console.log(value)
  }
}



function getPositionAndSection(slot: string): TPositionAndSection {
  const [position, section] = getArrFromDelimitedStr(slot,':');
  return {position, section}
}