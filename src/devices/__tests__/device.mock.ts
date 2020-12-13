import { Device } from '~/devices/device';

export class MockDevice implements Device {
  counter = 1;

  measure() {
    return Promise.resolve(this.counter++);
  }
}