import { Device } from '~/devices/device';

export class CountingDevice implements Device {
  name = 'Counting'
  counter = 1;
  interval = 1;

  constructor(options: Partial<CountingDevice> = {}) {
    if (options.name) {
      this.name = options.name;
    }

    if (options.interval) {
      this.interval = options.interval;
    }

    if (options.counter) {
      this.counter = options.counter;
    }
  }

  measure(): Promise<number> {
    const promise = Promise.resolve(this.counter);
    this.counter++;
    return promise;
  }
}