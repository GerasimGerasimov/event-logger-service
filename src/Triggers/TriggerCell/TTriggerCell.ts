import { TArg } from "../Args/TArg";
import { ITriggerCellResult } from "./iTreggerCell";

export abstract class TTriggerCell {
  public abstract update(args: Map<string, TArg>): ITriggerCellResult | Error;
  public abstract setInitialState(): void;
}
