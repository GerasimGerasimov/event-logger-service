import { TArg } from "../Args/TArg";
import { TTriggerProps } from "../Trigger/TTriggerProps";
import { TTriggerCell } from "./TTriggerCell";

export class TTriggerRear extends TTriggerCell {

  constructor (props: TTriggerProps) {
    super();
  }
  
  public update(args: Map<string, TArg>): void | Error {

  }
}