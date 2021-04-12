import { Device } from '~/devices/device';

export class ManualDevice implements Device {
  name = 'Manual'
  value = 1;
  interval = 1;

  constructor(options: Partial<ManualDevice> = {}) {
    if (options.name) {
      this.name = options.name;
    }

    if (options.interval) {
      this.interval = options.interval;
    }

    if (options.value) {
      this.value = options.value;
    }
  }

  measure(): Promise<number> {
    return Promise.resolve(this.value);
  }
}