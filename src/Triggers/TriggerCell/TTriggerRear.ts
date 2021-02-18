import { IEvent } from "../../db/iDBEvent";
import { TArg } from "../Args/TArg";
import { TTriggerProps } from "../Trigger/TTriggerProps";
import { TTriggerCell } from "./TTriggerCell";

export class TTriggerRear extends TTriggerCell {

  constructor (props: TTriggerProps) {
    super();
  }

  public getTrigEvent(args: Map<string, TArg>): IEvent | undefined {
    const trig: IEvent = undefined;
    return trig;
  }

  public setInitialState(): void {
    
  }
}