import { TArg } from "../Args/TArg";

export abstract class TTriggerCell {
  public abstract update(args: Map<string, TArg>): void | Error;
}
