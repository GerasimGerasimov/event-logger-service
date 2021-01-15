import { TArg } from "../Args/TArg";
import { ITriggerCellResult } from "./iTreggerCell";

export abstract class TTriggerCell {
  public abstract getTrigEvent(args: Map<string, TArg>): ITriggerCellResult | undefined;
  public abstract setInitialState(): void;
}
