export class Clock {
  private startTime: number = 0;
  private lastTime: number = 0;
  private running: boolean = false;
  public elapsedTime: number = 0;
  public delta: number = 0;

  start() {
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  update() {
    if (!this.running) {
      this.delta = 0;
      return;
    }
    const currentTime = performance.now();
    this.delta = (currentTime - this.lastTime) / 1000.0;
    this.elapsedTime += this.delta;
    this.lastTime = currentTime;
  }
}
