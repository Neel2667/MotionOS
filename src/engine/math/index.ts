/**
 * Math namespace for MotionOS
 * For Milestone 1, we rely heavily on Three.js math primitive integrations.
 * If future extensions require purely custom interpolations, they will go here.
 */

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
