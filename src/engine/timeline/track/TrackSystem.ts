import { v4 as uuidv4 } from 'uuid';
import { AnimationChannel } from '../binding/PropertyBinding';

export class Track {
  public id: string = uuidv4();
  public name: string;
  public muted: boolean = false;
  public soloed: boolean = false;
  public locked: boolean = false;
  public channels: AnimationChannel[] = [];
  
  constructor(name: string) {
    this.name = name;
  }
}

export class TrackLayer {
  public id: string = uuidv4();
  public name: string;
  public tracks: Track[] = [];
  
  constructor(name: string) {
    this.name = name;
  }
}

export class TrackGroup {
  public id: string = uuidv4();
  public name: string;
  public layers: TrackLayer[] = [];
  
  constructor(name: string) {
    this.name = name;
  }
}

export class TrackCollection {
  public groups: TrackGroup[] = [];
}

export class TrackBinding {
  public trackId: string;
  public entityId: string;
  constructor(trackId: string, entityId: string) {
    this.trackId = trackId;
    this.entityId = entityId;
  }
}

export class TrackRegistry {
  public tracks: Map<string, Track> = new Map();
  
  addTrack(track: Track) { this.tracks.set(track.id, track); }
  removeTrack(id: string) { this.tracks.delete(id); }
  
  mute(id: string, muted: boolean = true) {
    const t = this.tracks.get(id);
    if (t) t.muted = muted;
  }
  
  solo(id: string, soloed: boolean = true) {
    const t = this.tracks.get(id);
    // Real implementation would unset solo on others
    if (t) t.soloed = soloed;
  }
  
  lock(id: string, locked: boolean = true) {
    const t = this.tracks.get(id);
    if (t) t.locked = locked;
  }
  
  enable(id: string) { this.mute(id, false); }
  disable(id: string) { this.mute(id, true); }
}

export class TrackCache {
  private cache: Map<string, any> = new Map();
  invalidate() {}
  rebuild() {}
  serialize() {}
}
