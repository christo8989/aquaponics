import { DeviceObservable } from '~/devices/device-observable';
import { CountingDevice } from '~/devices/counting.device';
import { Engine } from '~/engine';
import { EMPTY_ACTION } from '~/utils/function.helpers';

describe('engine', () => {
  const observer = { next: EMPTY_ACTION };

  it('should have a start function', () => {
    const engine = new Engine({ devices: [], observer });
    expect(typeof engine.start).toBe('function');
  });

  it('should start and stop with no memory leaks', done => {
    const interval = 10;
    const device = new CountingDevice({ interval });
    const engine = new Engine({ devices: [device], observer });

    const measureSpy = jest.spyOn(device, 'measure');

    engine.start();
    setTimeout(() => {
      expect(measureSpy).toHaveBeenCalled();
      engine.stop();
      measureSpy.mockReset();

      setTimeout(() => {
        expect(measureSpy).not.toHaveBeenCalled();
        done();
      }, interval * 2);

    }, interval * 2);
  });

  it('should accept a mixture of devices and device observables', () => {
    const action = () => {
      new Engine({
        devices: [
          new CountingDevice({ interval: 10 }),
          new DeviceObservable(new CountingDevice({ name: 'Observable', interval: 10 })),
        ],
        observer,
      });
    };
    expect(action).not.toThrowError();
  });
});