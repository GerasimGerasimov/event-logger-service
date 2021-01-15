import { TArg } from "../Args/TArg";
import { TTriggerProps } from "../Trigger/TTriggerProps";
import { ITriggerCellResult } from "./iTreggerCell";
import { TTriggerCell } from "./TTriggerCell";

export class TTriggerRear extends TTriggerCell {

  constructor (props: TTriggerProps) {
    super();
  }

  public getTrigEvent(args: Map<string, TArg>): ITriggerCellResult | undefined {
    const trig: ITriggerCellResult = {trig:''};
    return trig;
  }

  public setInitialState(): void {
    
  }
}