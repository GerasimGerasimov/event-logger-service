import { IEvent } from "../../interfaces/iDBEvent";
import { TArg } from "../Args/TArg";

export abstract class TTriggerCell {
  public abstract getTrigEvent(args: Map<string, TArg>): IEvent | undefined;
  public abstract setInitialState(): void;
}
