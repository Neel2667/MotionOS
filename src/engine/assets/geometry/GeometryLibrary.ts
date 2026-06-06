export enum GeometryType {
  CIRCLE = 'CIRCLE',
  RECTANGLE = 'RECTANGLE',
  TRIANGLE = 'TRIANGLE',
  POLYGON = 'POLYGON',
  RING = 'RING',
  ARC = 'ARC',
  RIBBON = 'RIBBON',
  WAVE = 'WAVE',
  SPLINE = 'SPLINE',
  GRID = 'GRID',
  HELIX = 'HELIX',
  SPIRAL = 'SPIRAL',
  BEAM = 'BEAM',
  CRYSTAL = 'CRYSTAL',
  SHARD = 'SHARD',
  PANEL = 'PANEL',
  ABSTRACT_MESH = 'ABSTRACT_MESH'
}

export class GeometryLibrary {
  static getDefinition(type: GeometryType): Record<string, any> {
    switch (type) {
      case GeometryType.CIRCLE: return { radius: 1, segments: 32 };
      case GeometryType.RECTANGLE: return { width: 1, height: 1 };
      case GeometryType.TRIANGLE: return { base: 1, height: 1 };
      case GeometryType.POLYGON: return { radius: 1, sides: 6 };
      case GeometryType.RING: return { innerRadius: 0.5, outerRadius: 1, segments: 32 };
      case GeometryType.ARC: return { radius: 1, startAngle: 0, endAngle: Math.PI, segments: 16 };
      case GeometryType.RIBBON: return { path: [], width: 0.1 };
      case GeometryType.WAVE: return { frequency: 1, amplitude: 1, length: 10 };
      case GeometryType.SPLINE: return { points: [], tension: 0.5 };
      case GeometryType.GRID: return { width: 10, height: 10, subdivisions: 10 };
      case GeometryType.HELIX: return { radius: 1, height: 5, turns: 3 };
      case GeometryType.SPIRAL: return { startRadius: 0.1, endRadius: 2, turns: 4 };
      case GeometryType.BEAM: return { length: 5, depth: 0.1, taper: 0.5 };
      case GeometryType.CRYSTAL: return { complexity: 0.5, height: 2, radius: 0.5 };
      case GeometryType.SHARD: return { irregularity: 0.8, size: 1 };
      case GeometryType.PANEL: return { width: 2, height: 2, bevel: 0.1 };
      case GeometryType.ABSTRACT_MESH: return { noiseScale: 1, resolution: 16 };
      default: return {};
    }
  }
}
