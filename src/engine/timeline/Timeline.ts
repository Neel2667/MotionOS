export class Timeline {
  public currentTime: number = 0;
  public playing: boolean = false;
  public duration: number = 0;

  play() {
    this.playing = true;
  }

  pause() {
    this.playing = false;
  }

  stop() {
    this.playing = false;
    this.currentTime = 0;
  }

  seek(time: number) {
    this.currentTime = Math.max(0, time);
  }

  update(delta: number) {
    if (this.playing) {
      this.currentTime += delta;
      
      // Stop or loop could be implemented here based on duration config
      if (this.duration > 0 && this.currentTime > this.duration) {
         this.stop(); 
      }
    }
  }
}
