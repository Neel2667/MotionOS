import { OpcodeRegistry } from '../opcodes/Opcode';
import * as CoreOps from '../opcodes/CoreOpcodes';
import * as MathOps from '../opcodes/math/MathOpcodes';
import * as VectorOps from '../opcodes/math/VectorOpcodes';
import * as MatrixOps from '../opcodes/math/MatrixOpcodes';
import * as TrigOps from '../opcodes/math/TrigOpcodes';
import * as NoiseOps from '../opcodes/noise/NoiseOpcodes';
import * as CurveOps from '../opcodes/curve/CurveOpcodes';
import * as TransformOps from '../opcodes/transform/TransformOpcodes';

export class CoreRegistry extends OpcodeRegistry {
  constructor() {
    super();
    this.register(new CoreOps.OpSetObject());
    this.register(new CoreOps.OpTranslate());
    this.register(new CoreOps.OpRotate());
    this.register(new CoreOps.OpScale());
    this.register(new CoreOps.OpLoadObject());
    this.register(new CoreOps.OpBeginScope());
    this.register(new CoreOps.OpEndScope());
    this.register(new CoreOps.OpNop());
  }
}

export class MathRegistry extends OpcodeRegistry {
  constructor() {
    super();
    this.register(new MathOps.OpAdd());
    this.register(new MathOps.OpSub());
    this.register(new MathOps.OpMul());
    this.register(new MathOps.OpDiv());
    this.register(new MathOps.OpMod());
    this.register(new MathOps.OpNeg());
    this.register(new MathOps.OpAbs());
    this.register(new MathOps.OpMin());
    this.register(new MathOps.OpMax());
    this.register(new MathOps.OpClamp());
    this.register(new MathOps.OpLerp());
    this.register(new MathOps.OpSmoothstep());
    this.register(new MathOps.OpStep());
    this.register(new MathOps.OpFloor());
    this.register(new MathOps.OpCeil());
    this.register(new MathOps.OpRound());
    this.register(new MathOps.OpFract());
    this.register(new MathOps.OpSign());
    this.register(new MathOps.OpSaturate());
    
    this.register(new VectorOps.OpVec2Add());
    this.register(new VectorOps.OpVec3Add());
    this.register(new VectorOps.OpVec4Add());
    this.register(new VectorOps.OpVec2Sub());
    this.register(new VectorOps.OpVec3Sub());
    this.register(new VectorOps.OpVec4Sub());
    this.register(new VectorOps.OpDot());
    this.register(new VectorOps.OpCross());
    this.register(new VectorOps.OpNormalize());
    this.register(new VectorOps.OpLength());
    this.register(new VectorOps.OpDistance());
    this.register(new VectorOps.OpProject());
    this.register(new VectorOps.OpReflect());
    
    this.register(new MatrixOps.OpMatMul());
    this.register(new MatrixOps.OpMatInv());
    this.register(new MatrixOps.OpMatTranspose());
    this.register(new MatrixOps.OpMatScale());
    this.register(new MatrixOps.OpMatRotate());
    this.register(new MatrixOps.OpMatTranslate());
    this.register(new MatrixOps.OpTransformPoint());
    this.register(new MatrixOps.OpTransformVector());
    
    this.register(new TrigOps.OpSin());
    this.register(new TrigOps.OpCos());
    this.register(new TrigOps.OpTan());
    this.register(new TrigOps.OpAsin());
    this.register(new TrigOps.OpAcos());
    this.register(new TrigOps.OpAtan());
    this.register(new TrigOps.OpAtan2());
    this.register(new TrigOps.OpRadians());
    this.register(new TrigOps.OpDegrees());
  }
}

export class CurveRegistry extends OpcodeRegistry {
  constructor() {
    super();
    this.register(new CurveOps.OpBezierCurve());
    this.register(new CurveOps.OpSplineCurve());
    this.register(new CurveOps.OpCatmullRom());
    this.register(new CurveOps.OpHermite());
    this.register(new CurveOps.OpEaseLinear());
    this.register(new CurveOps.OpEaseIn());
    this.register(new CurveOps.OpEaseOut());
    this.register(new CurveOps.OpEaseInOut());
    this.register(new CurveOps.OpBounce());
    this.register(new CurveOps.OpElastic());
    this.register(new CurveOps.OpBack());
    this.register(new CurveOps.OpCustomCurve());
  }
}

export class NoiseRegistry extends OpcodeRegistry {
  constructor() {
    super();
    this.register(new NoiseOps.OpValueNoise());
    this.register(new NoiseOps.OpGradientNoise());
    this.register(new NoiseOps.OpPerlin());
    this.register(new NoiseOps.OpSimplex());
    this.register(new NoiseOps.OpFBM());
    this.register(new NoiseOps.OpTurbulence());
    this.register(new NoiseOps.OpRidged());
    this.register(new NoiseOps.OpHashRandom());
    this.register(new NoiseOps.OpSeedRandom());
  }
}

export class TransformRegistry extends OpcodeRegistry {
  constructor() {
    super();
    this.register(new TransformOps.OpComposeTransform());
    this.register(new TransformOps.OpDecomposeTransform());
    this.register(new TransformOps.OpInterpolateTransform());
    this.register(new TransformOps.OpQuaternionMultiply());
    this.register(new TransformOps.OpQuaternionNormalize());
    this.register(new TransformOps.OpQuaternionSlerp());
    this.register(new TransformOps.OpEulerToQuaternion());
    this.register(new TransformOps.OpQuaternionToEuler());
  }
}

export class CoreOpcodeRegistries {
  public core = new CoreRegistry();
  public math = new MathRegistry();
  public curve = new CurveRegistry();
  public noise = new NoiseRegistry();
  public transform = new TransformRegistry();
  
  public get(nameOrId: string) {
    return this.core.get(nameOrId) || this.math.get(nameOrId) || this.curve.get(nameOrId) || this.noise.get(nameOrId) || this.transform.get(nameOrId);
  }
}
