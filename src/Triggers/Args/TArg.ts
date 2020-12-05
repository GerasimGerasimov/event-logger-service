import { IArgInfo } from "../iTriggers";

export abstract class TArg {

  protected value: number = undefined;

  public abstract get Value(): number;

}

export class TArgTag extends TArg {
  
  constructor(position: string, arg: IArgInfo){
    super();
  }

  public get Value(): number {
    return this.value;
  }
}

export class TArgConst extends TArg {

  constructor(arg: IArgInfo){
    super();
    this.value = arg.value;
  }

  public get Value(): number {
    return this.value;
  }
}

type EArgTypes = 'TArgConst' | 'TArgTag';

export function ArgFactory (position: string, arg: IArgInfo): TArg  {
  const ObjType: EArgTypes = getArgObjectType(arg);
  const ObjTypes: {[index: string]: any} = {
      'TArgTag'   : () => {return new TArgTag (position, arg)},
      'TArgConst' : () => {return new TArgConst (arg)},
      'default': () => {
          console.log(`${ObjType} not found`)
          return undefined;
      }
  }
  return (ObjTypes[ObjType] || ObjTypes['default'])()
}

function getArgObjectType(arg: IArgInfo): EArgTypes {
  return (arg.tag === '')? 'TArgConst' : 'TArgTag';
}

