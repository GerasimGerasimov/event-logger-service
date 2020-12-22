import { TArg } from "../Args/TArg";
import { TTriggerProps } from "../Trigger/TTriggerProps";
import { ETriggerCellState, ITriggerCellResult } from "./iTreggerCell";
import { TTriggerCell } from "./TTriggerCell";

export class TTriggerFront extends TTriggerCell {
  
  private triggerProps: TTriggerProps;
  private args: Map<string, TArg>
  private state: ETriggerCellState;

  constructor (props: TTriggerProps) {
    super();
    this.triggerProps = props;
    this.setInitialState();
  }
  
  public update(args: Map<string, TArg>): ITriggerCellResult | Error {
    //считается что аргументы пришли уже проверенные
    this.args = args;
    const trig: ITriggerCellResult = {trig:''};
    this.doStateAction();
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
  private doStateAction() {
    switch (this.state) {
      case ETriggerCellState.WaitValidValues:
       this.setInitialCellState();
       break;
      case ETriggerCellState.WaitReset: break;
      case ETriggerCellState.WaitSet: break;
    }
  }

  private setInitialCellState() {
    /*TODO аргументы валидны (раз сюда пришли) значит надо установить ячейку
           в текущее (по аргументам) состояние и определить какое событие ждать дальше
           для FRONT-ячейки это будет либо событие WaitSet, либо WaitReset */
    this.getTemporaryState();
  }

  private getTemporaryState() {
      /**arg1 >= setCondition -> находится в состоянии Set поэтому надо ждать ReSet, ставлю WaitReset */
      /**arg1 <= resetCondition -> находится в состоянии Reset поэтому надо ждать Set, ставлю WaitSet */
      try {
        const arg1 = this.args.get('arg1').Value;
        const arg2 = this.args.get('arg2').Value;
        if ( arg1 >= arg2 ) {
          this.state = ETriggerCellState.WaitReset;
        } else {
          this.state = ETriggerCellState.WaitSet;
        }
      } catch { //могут не совпасть имена аргументов и ихкол-во
          this.state = ETriggerCellState.WaitValidValues;
      }
  }
}