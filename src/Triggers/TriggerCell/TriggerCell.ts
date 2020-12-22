import { isValueInEnum } from "../../helpers/utils";
import { TTriggerProps } from "../Trigger/TTriggerProps";
import { TTriggerCell } from "./TTriggerCell";
import { TTriggerFront } from "./TTriggerFront";
import { TTriggerRear } from "./TTriggerRear";
import { TTriggerToggle } from "./TTriggerToggle";

enum ETriggerTypes {
  'FRONT',
  'REAR',
  'TOGGLE'
}

export function TriggerCellFactory (props: TTriggerProps): TTriggerCell  {
  const ObjType: string = getTriggerCellObjectType(props.triggerProc);
  const ObjTypes: {[index: string]: any} = {
    'FRONT'  : () => {return new TTriggerFront  (props)},
    'REAR'   : () => {return new TTriggerRear   (props)},
    'TOGGLE' : () => {return new TTriggerToggle (props)},
    'default': () => {
        console.log(`${ObjType} not found`)
        return undefined;
    }
  }
  return (ObjTypes[ObjType] || ObjTypes['default'])()
}

function getTriggerCellObjectType(props: any): string {
  const res: string = isValueInEnum(ETriggerTypes, props) || 'default'
  return res;
}