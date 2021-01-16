export enum ETriggerCellState {
  WaitValidValues,
  WaitSet,
  WaitReset
}

export interface ITriggerCellResult {
  date: string;
  type: string;
  trig: string;
  describe: string;
  tag: string;
}