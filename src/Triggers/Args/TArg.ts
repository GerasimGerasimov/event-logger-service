import { getTagValue } from "../../Devices/deviceparser";
import { ITagAddress } from "../../Devices/ITagAddress";
import { IArgInfo } from "../iTriggers";

export abstract class TArg {
  protected value: number = undefined;

  public abstract get Value(): number;
  public abstract setValue();
  public abstract get Tag(): string;
  public abstract get TagAddr(): ITagAddress | undefined; 

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

  public setValue() {
    this.value = getTagValue(this.tagAddr);
  }

  public get Value(): number {
    return this.value;
  }

  public get TagAddr(): ITagAddress {
    return this.tagAddr
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

  public setValue() {}

  public get Value(): number {
    return this.value;
  }

  public get TagAddr(): undefined {
    return undefined
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

