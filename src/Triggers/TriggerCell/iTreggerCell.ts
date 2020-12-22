export enum ETriggerCellState {
  WaitValidValues,
  WaitSet,
  WaitReset
}

export interface ITriggerCellResult {
  trig: any;
}