export enum CameraBehaviorType {
  ORBIT = 'ORBIT',
  DOLLY = 'DOLLY',
  TRUCK = 'TRUCK',
  PEDESTAL = 'PEDESTAL',
  PAN = 'PAN',
  TILT = 'TILT',
  ROLL = 'ROLL',
  CRANE = 'CRANE',
  FOLLOW = 'FOLLOW',
  LOOK_AT = 'LOOK_AT',
  PATH_FOLLOW = 'PATH_FOLLOW'
}

export interface CameraBehaviorConfig {
  type: CameraBehaviorType;
  parameters: Record<string, any>;
}

export class CameraBehaviorState {
  // Evaluates a behavior into actual positional/rotational outputs over time t
  static evaluate(config: CameraBehaviorConfig, t: number, outPos: Float32Array, outQuat: Float32Array) {
    // Abstracted math ops translating instructions to arrays
  }
}
