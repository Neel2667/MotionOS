export enum RevealZone {
  HIDDEN = 'HIDDEN',
  ENTERING = 'ENTERING',
  FOCUS = 'FOCUS',
  HERO = 'HERO',
  EXIT = 'EXIT',
  TRANSITION = 'TRANSITION'
}

export class ZoneTracker {
  // Keeps track of the currently active semantic zone for any UUID over the timeline.
  // Helps drive dynamic AI adjustments like dimming background elements when HERO is active.
  private state: Map<string, RevealZone> = new Map();

  setZone(id: string, zone: RevealZone) {
    this.state.set(id, zone);
  }

  getZone(id: string): RevealZone {
    return this.state.get(id) || RevealZone.HIDDEN;
  }
}
