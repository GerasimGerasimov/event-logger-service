import { isValueInEnum } from "../../helpers/utils";
import { ETriggerType, ITriggerDesctripion } from "../iTriggers";

enum EConditionType {
  tag,
  constant
}

export class TCondition {
  type: EConditionType = EConditionType.constant;
  argName: string = '';
  value: number = 0;

  constructor (arg: {type: EConditionType, argName: string, value: number}) {
    this.type = arg.type;
    this.argName = arg.argName;
    this.value = arg.value
  }

  public getConditionValue(args: Map<string, number>): number {
    return (this.type == EConditionType.constant)
           ? this.value
           : args.get(this.argName);
  }
}

export class TTriggerProps {
  setCondition: TCondition;
  resetCondition: TCondition;
  tolerance: number = 0;
  triggerProc: ETriggerType = ETriggerType.FRONT;
  describe: any = {};
  eventType: string = '';

  constructor (description: ITriggerDesctripion,
                argsNames: Array<string>,
                  describe: any,
                    eventType: string){
    this.setCondition = this.setInitCondition(description.setCondition, argsNames),
    this.resetCondition = this.setInitCondition(description.resetCondition, argsNames),
    this.tolerance =this.setInitToleranse(description.tolerance),
    this.triggerProc = this.setInitTriggerProc(description.type)
    this.describe = describe;
    this.eventType = eventType;
  }

  private setInitCondition(prop: string, argsNames: Array<string>): TCondition {
    const value: number = Number(prop);
    if (isNaN(value)) {//кажись это аргумент - тэг
      return this.createTagCondition(prop, argsNames);
    } else {
      return this.createConstantCondition(value)
    }
  }

  private createTagCondition(prop: string, argsNames: Array<string>): TCondition {
    if (argsNames.includes(prop)) {
      const res: TCondition = new TCondition({
        type: EConditionType.tag,
        argName: prop,
        value: undefined
      })
      return res
    } else {
      throw new Error (`Argument ${prop} not found`)
    }
  }

  private createConstantCondition(value: number): TCondition {
    const res: TCondition = new TCondition({
      type: EConditionType.constant,
      argName:'',
      value
    })
    return res
  }

  private setInitToleranse(value: string): number {
    const tolerance: number = Number(value);
    if (!isNaN(tolerance)) {
      return tolerance;
    } else {
      throw new Error (`Tolerance ${value} isn't a number`) 
    }
  }

  private setInitTriggerProc(proc: ETriggerType): ETriggerType | never {
    if (isValueInEnum(ETriggerType, proc)) {
      return proc;
    }
    throw new Error (`Trigger function ${proc} not found`) 
  }
}