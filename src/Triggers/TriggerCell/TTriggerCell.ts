import { nowDateTimeToDBStr } from "../../helpers/utils";
import { IEvent } from "../../interfaces/iDBEvent";
import { TArg } from "../Args/TArg";
import { TTriggerProps } from "../Trigger/TTriggerProps";

export abstract class TTriggerCell {

  protected args: Map<string, TArg>;
  protected triggerProps: TTriggerProps;

  public abstract getTrigEvent(args: Map<string, TArg>): IEvent | undefined;
  public abstract setInitialState(): void;

  protected getArgsValues(): Map<string, number> {
    const res: Map<string, number> = new Map()
    for ( const [key, arg] of this.args.entries()) {
      const value = arg.Value
      res.set(key, value)
    }
    return res
  }

  protected fillEvent(input: number, setValue: number): IEvent {
    const res: IEvent = {
      date: nowDateTimeToDBStr(),
      type: this.triggerProps.eventType,
      trig: this.triggerProps.triggerProc.toString(),
      tag: this.args.get('input').Tag,
      details: {
        initialValue: `input: ${input} >= setValue: ${setValue}`,
        comment: this.triggerProps.describe.comment['ru'],
        todo:''
      }
    }
    return res;
  }
}
