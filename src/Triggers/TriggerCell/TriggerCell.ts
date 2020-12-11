import { TTriggerCell } from "./TTriggerCell";
import { TTRiggerFront } from "./TTriggerFront";
import { TTRiggerRear } from "./TTriggerRear";
import { TTRiggerToggle } from "./TTriggerToggle";

type ETriggerTypes = 'FRONT' | 'REAR' | 'TOGGLE';

export function TriggerCellFactory (props: any): TTriggerCell  {
  const ObjType: ETriggerTypes = getTriggerCellObjectType(props);
  const ObjTypes: {[index: string]: any} = {
    'FRONT'  : () => {return new TTRiggerFront  ()},
    'REAR'   : () => {return new TTRiggerRear   ()},
    'TOGGLE' : () => {return new TTRiggerToggle ()},
    'default': () => {
        console.log(`${ObjType} not found`)
        return undefined;
    }
  }
  return (ObjTypes[ObjType] || ObjTypes['default'])()
}

function getTriggerCellObjectType(props: any): ETriggerTypes {
  return 'FRONT'
}