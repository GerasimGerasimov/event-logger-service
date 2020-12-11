import { isValueInEnum } from "../../helpers/utils";
import { TTriggerProps } from "../Trigger/TTriggerProps";
import { TTriggerCell } from "./TTriggerCell";
import { TTRiggerFront } from "./TTriggerFront";
import { TTRiggerRear } from "./TTriggerRear";
import { TTRiggerToggle } from "./TTriggerToggle";

enum ETriggerTypes {
  'FRONT',
  'REAR',
  'TOGGLE'
}

export function TriggerCellFactory (props: TTriggerProps): TTriggerCell  {
  const ObjType: string = getTriggerCellObjectType(props.triggerProc);
  const ObjTypes: {[index: string]: any} = {
    'FRONT'  : () => {return new TTRiggerFront  (props)},
    'REAR'   : () => {return new TTRiggerRear   (props)},
    'TOGGLE' : () => {return new TTRiggerToggle (props)},
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