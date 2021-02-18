import { IEvent } from "../../db/iDBEvent";
import { TArg } from "../Args/TArg";
import { TCondition, TTriggerProps } from "../Trigger/TTriggerProps";
import { ETriggerCellState} from "./iTreggerCell";
import { TTriggerCell } from "./TTriggerCell";

export class TTriggerFront extends TTriggerCell {
  
  private state: ETriggerCellState;

  constructor (props: TTriggerProps) {
    super();
    this.triggerProps = props;
    this.setInitialState();
  }
  
  public getTrigEvent(args: Map<string, TArg>): IEvent | undefined {
    this.args = args;
    const trig: IEvent = this.doStateAction();
    return trig;
  }

  public setInitialState(): void {
    this.state = ETriggerCellState.WaitValidValues;
  }

  private doStateAction():IEvent | undefined {
    try {
        const values: Map<string, number> = this.getArgsValues();
        switch (this.state) {
          case ETriggerCellState.WaitValidValues:
            return this.setInitialCellState(values);
          case ETriggerCellState.WaitReset:
            return this.waitChangeStateToReset(values);
          case ETriggerCellState.WaitSet: 
            return this.waitChangeStateToSet(values);
        }
    } catch (e) {
      this.state = ETriggerCellState.WaitValidValues;
    }
  }

  private waitChangeStateToSet(args: Map<string, number>): IEvent | undefined {
    const input = args.get('input')
    const setCondition= this.triggerProps.setCondition;
    const setValue: number = setCondition.getConditionValue(args)
    if (input >= setValue) {
      this.state = ETriggerCellState.WaitReset;
      const res: IEvent = this.fillEvent(input, setValue)
      return res;
    }
    return undefined;
  }

  private waitChangeStateToReset(args: Map<string, number>): undefined {
    const input = args.get('input')
    const resetCondition= this.triggerProps.resetCondition;
    const resetValue: number = resetCondition.getConditionValue(args)
    if (input <= resetValue) {
      this.state = ETriggerCellState.WaitSet;
    }
    return undefined;
  }

  private setInitialCellState(args: Map<string, number>): undefined {
    const resetCondition: TCondition = this.triggerProps.resetCondition;
    const setCondition: TCondition = this.triggerProps.setCondition;
    const resetValue: number = resetCondition.getConditionValue(args);
    const setValue: number = setCondition.getConditionValue(args)
    const input = args.get('input')
    
    if (input <= resetValue) {
      this.state = ETriggerCellState.WaitSet;
      return undefined
    }
    if (input >= setValue) {
      this.state = ETriggerCellState.WaitReset;
      return undefined
    }
    /**TODO что делать если input между resetValue и setValue  (resetValue< input < setValue)
     * это актуально для НЕ boolean значений
     */
  }

}