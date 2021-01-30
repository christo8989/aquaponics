import { combineLatest } from 'rxjs';
import { DeviceObservable } from '~/devices/device-observable';
import { performance } from 'perf_hooks';
import { Device } from '~/devices/device';
import { CountingDevice } from '~/devices/counting.device';
import { startWith } from 'rxjs/operators';

describe('DeviceObservable', () => {
  const interval = 1;
  let device: Device;
  let observable: DeviceObservable;

  beforeEach(() => {
    device = new CountingDevice({ interval });
    jest.spyOn(device, 'measure');
    observable = new DeviceObservable(device);
  });

  afterEach(() => {
    observable = null as any;
    device = null as any;
  });

  it('should publish on a timer', done => {
    let calls = 0;
    const start = performance.now();
    const unsubscribe = observable.subscribe(_ => {
      ++calls;
      if (calls === 3) {
        unsubscribe.unsubscribe();
        const delta = performance.now() - start;
        expect(delta).toBeGreaterThanOrEqual(interval * calls);
        done();
      }
    });
  });

  it('should publish a value', done => {
    const unsubscribe = observable.subscribe(value => {
      expect(typeof value).toBe('number');
      unsubscribe.unsubscribe();
      done();
    });
  });

  it('no subscriptions should clear the interval', done => {
    let calls = 0;
    const expectedCalls = 2;
    const unsubscribe = observable.subscribe(_ => {
      ++calls;
      if (calls === expectedCalls) {
        unsubscribe.unsubscribe();
        setTimeout(() => {
          expect(device.measure).toHaveBeenCalledTimes(expectedCalls);
          done();
        }, interval * expectedCalls);
      }
    });
  });

  it('multiple subscriptions should use the same interval', done => {
    const first = observable.subscribe(_ => {
      first.unsubscribe();
    });
    const second = observable.subscribe(_ => {
      second.unsubscribe();
    });
    const third = observable.subscribe(_ => {
      third.unsubscribe();
      expect(device.measure).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('combining should publish at the different intervals', done => {
    const start = performance.now();
    const longInterval = 80;
    const firstObservable = new DeviceObservable(new CountingDevice({ name: 'First', interval: longInterval }));
    const shortInterval = 39;
    const secondObservable = new DeviceObservable(new CountingDevice({ name: 'Second', interval: shortInterval }));

    let calls = 0;
    const maxCalls = 3;
    const zipped$ = combineLatest([
      firstObservable.pipe(startWith(0)), 
      secondObservable.pipe(startWith(0)),
    ]).subscribe(values => {
      calls++;
      if (calls >= maxCalls) {
        zipped$.unsubscribe();
        const delta = performance.now() - start;
        setTimeout(() => {
          expect(delta).toBeGreaterThanOrEqual(longInterval);
          expect(delta).toBeLessThan(shortInterval * maxCalls);
          done();
        });
      }
    });
  });

  it('should throw an error if its given another observable', () => {
    const action = () => {
      new DeviceObservable(
        new DeviceObservable(
          new CountingDevice(),
        ),
      );
    };
    expect(action).toThrowError();
  });
});