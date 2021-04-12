import { Engine } from '../../src';
import { CountingDevice } from '../../src/devices';


const engine = new Engine({
  devices: [
    new CountingDevice({
      name: 'Fast',
      interval: 1000,
    }),
    new CountingDevice({
      name: 'Medium',
      interval: 1000 * 12,
    }),
    new CountingDevice({
      name: 'Slow',
      interval: 1000 * 25,
    }),
  ],
  observer: {
    next: console.log,
  },
});

engine.start();

setTimeout(() => {
  engine.stop();
}, 60 * 1000);