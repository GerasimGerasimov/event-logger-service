import { TArg } from "../Args/TArg";
import { TCondition, TTriggerProps } from "../Trigger/TTriggerProps";
import { ETriggerCellState, ITriggerCellResult } from "./iTreggerCell";
import { TTriggerCell } from "./TTriggerCell";

export class TTriggerFront extends TTriggerCell {
  
  private triggerProps: TTriggerProps;
  private args: Map<string, TArg>;
  private state: ETriggerCellState;

  constructor (props: TTriggerProps) {
    super();
    this.triggerProps = props;
    this.setInitialState();
  }
  
  public getTrigEvent(args: Map<string, TArg>): ITriggerCellResult | undefined {
    this.args = args;
    const trig: ITriggerCellResult = this.doStateAction();
    return trig;
  }

  public setInitialState(): void {
    this.state = ETriggerCellState.WaitValidValues;
  }

  /*TODO
    1) если триггер в WaitValidValues то (раз сюда попали значит они Валидны)
       то надо "предзарядить" триггер на основании текущих значений аргументов
       чтобы небыло ложного срабатывания. После этого действия, состояние
       установится либо в WaitSet либо в WaitReset
    2) Устаналивать противоположенное состение в зависимости от условий WaitSet либо в WaitReset
    */
  private getArgsValues(): Map<string, number> {
    const res: Map<string, number> = new Map()
    for ( const [key, arg] of this.args.entries()) {
      const value = arg.Value
      res.set(key, value)
    }
    return res
  }

  private doStateAction():ITriggerCellResult | undefined {
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

  private waitChangeStateToSet(args: Map<string, number>): ITriggerCellResult | undefined {
    const input = args.get('input')
    const setCondition= this.triggerProps.setCondition;
    const setValue: number = setCondition.getConditionValue(args)
    if (input >= setValue) {
      this.state = ETriggerCellState.WaitReset;
      /**TODO вынести формирование ITriggerCellResult в отдельную функцию */
      /**TODO сообщить что сработал триггер SET */
      const res: ITriggerCellResult = {
        date: new Date().toISOString(), /**TODO добавлять дату создания */
        type: this.triggerProps.eventType,
        trig: this.triggerProps.triggerProc.toString(), //FRONT /**TODO проверить что получаю строку */
        describe: this.triggerProps.describe.comment['ru'], 
        tag: this.args.get('input').Tag
      }
      return res;
    }
    return undefined;
  }

  private waitChangeStateToReset(args: Map<string, number>): undefined {
    const input = args.get('input')
    const resetCondition= this.triggerProps.setCondition;
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
    
    this.state = (input >= setValue)
    ? ETriggerCellState.WaitReset
    : ETriggerCellState.WaitSet
    return undefined;
  }

}