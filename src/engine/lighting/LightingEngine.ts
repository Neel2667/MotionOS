import { v4 as uuidv4 } from 'uuid';

export enum LightingPreset {
  LUXURY = 'LUXURY',
  TECH = 'TECH',
  SPORTS = 'SPORTS',
  MINIMAL = 'MINIMAL',
  EPIC = 'EPIC',
  DARK = 'DARK'
}

export class LightRig {
  public id: string = uuidv4();
  public type: 'KEY' | 'FILL' | 'RIM' | 'SPOT' | 'AREA' | 'POINT' = 'POINT';
  public color: string = '#ffffff';
  public intensity: number = 1.0;
  public position: Float32Array = new Float32Array([0, 10, 0]);
  public target: Float32Array | null = null;
}

export class EnvironmentRig {
  public id: string = uuidv4();
  public hdriEquirectangularUrl: string = '';
  public environmentIntensity: number = 1.0;
  public backgroundBlur: number = 0.0;
}

export class LightingManager {
  public activeLights: LightRig[] = [];
  public environment: EnvironmentRig = new EnvironmentRig();

  applyPreset(preset: LightingPreset) {
    this.activeLights = [];
    switch (preset) {
      case LightingPreset.LUXURY:
        // High contrast, warm key, subtle rim
        const luxKey = new LightRig(); luxKey.type = 'KEY'; luxKey.intensity = 2.0; luxKey.color = '#fff0dd';
        const luxRim = new LightRig(); luxRim.type = 'RIM'; luxRim.intensity = 5.0; luxRim.color = '#ffffff';
        this.activeLights.push(luxKey, luxRim);
        this.environment.environmentIntensity = 0.5;
        break;
      case LightingPreset.TECH:
        // Cool tones, multiple spots
        const techKey = new LightRig(); techKey.type = 'SPOT'; techKey.intensity = 3.0; techKey.color = '#00ffff';
        const techFill = new LightRig(); techFill.type = 'FILL'; techFill.intensity = 1.0; techFill.color = '#ff00ff';
        this.activeLights.push(techKey, techFill);
        break;
      // Other presets...
    }
  }
}
