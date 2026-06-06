export class Config {
  private config: Record<string, any> = {};

  constructor(initial?: Record<string, any>) {
    if (initial) this.config = { ...initial };
  }

  get(key: string, defaultValue?: any): any {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  set(key: string, value: any) {
    this.config[key] = value;
  }
}
