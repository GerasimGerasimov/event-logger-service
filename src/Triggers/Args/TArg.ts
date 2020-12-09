import { getTagValue, ITagAddress } from "../../Test/deviceparser";
import { IArgInfo } from "../iTriggers";

export abstract class TArg {
  protected value: number = undefined;

  public abstract get Value(): number;
  public abstract setValue(data: any);
  public abstract get Tag(): string;

}

export class TArgTag extends TArg {
  private tag: string = '';
  private tagAddr: ITagAddress;
  constructor(position: string, arg: IArgInfo){
    super();
    this.tag = `${position}/${arg.section}/${arg.tag}`;
    this.tagAddr = {
      position,
      section: arg.section,
      tag: arg.tag
    }
  }

  public get Tag(): string {
    return this.tag;
  }

  public setValue(data: any) {
    this.value = getTagValue(this.tagAddr, data);
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

  public get Tag(): string {
    return 'TArgConst';
  }

  public setValue(data: any) {}

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

