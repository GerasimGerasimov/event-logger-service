import { ETriggerType, ITriggerDesctripion } from "../iTriggers";

enum EConditionType {
  tag,
  constant
}

class TCondition {
  type: EConditionType = EConditionType.constant;
  argName: string = '';
  value: number = 0;
}

export class TTriggerProps {
  setCondition: TCondition;
  resetCondition: TCondition;
  tolerance: number = 0;
  triggerProc: ETriggerType = ETriggerType.FRONT;

  constructor (description: ITriggerDesctripion, argsNames: Array<string>){
    this.setCondition = this.setInitCondition(description.setCondition, argsNames),
    this.resetCondition = this.setInitCondition(description.resetCondition, argsNames),
    this.tolerance =this.setInitToleranse(description.tolerance),
    this.triggerProc = this.setInitTriggerProc(description.type)
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
      return {
        type: EConditionType.tag,
        argName: prop,
        value: undefined
      }
    } else {
      throw new Error (`Argument ${prop} not found`)
    }
  }

  private createConstantCondition(value: number): TCondition {
    return {
      type: EConditionType.constant,
      argName:'',
      value
    }
  }

  private setInitToleranse(value: string): number {
    const tolerance: number = Number(value);
    if (!isNaN(tolerance)) {
      return tolerance;
    } else {
      throw new Error (`Tolerance ${value} isn't a number`) 
    }
  }

  private setInitTriggerProc(proc: ETriggerType): ETriggerType {
    if (this.hasValueOnEnum(ETriggerType, proc)) {
      return proc;
    } else {
      throw new Error (`Trigger function ${proc} not found`) 
    }
  }

  private hasValueOnEnum (Enum: any, value: any): boolean {
    for (const [key, enumValue] of Object.entries(Enum)) {
      if (value === enumValue) return true;
    }
    return false
  }
}