import { DeviceObservable } from '~/devices/device-observable';
import { performance } from 'perf_hooks';
import { MockDevice } from '~/devices/__tests__/device.mock';

describe('DeviceObservable', () => {
  const interval = 1;
  let device: MockDevice;
  let observable: DeviceObservable;

  beforeEach(() => {
    device = new MockDevice();
    jest.spyOn(device, 'measure');
    observable = new DeviceObservable(device, { interval });
  });

  afterEach(() => {
    observable = null as any;
    device = null as any;
  });

  it('should create the observable', () => {
    expect(observable).toBeTruthy();
  });

  it('should be subscribable', () => {
    expect(typeof observable.subscribe).toBe('function');
  });

  it('should publish on a timer', done => {
    const start = performance.now();
    const unsubscribe = observable.subscribe(_ => {
      const calls = (device.measure as any).mock.calls.length;
      if (calls === 3) {
        unsubscribe.unsubscribe();
        const delta = performance.now() - start;
        expect(delta).toBeGreaterThanOrEqual(interval * calls);
        done();
      }
    });
  });

  it('should publish a number', done => {
    const unsubscribe = observable.subscribe(value => {
      expect(typeof value).toBe('number');
      unsubscribe.unsubscribe();
      done();
    });
  });

  it('should unsubscribe', done => {
    const expectedCalls = 2;
    const unsubscribe = observable.subscribe(calls => {
      if (calls === expectedCalls) {
        unsubscribe.unsubscribe();
        setTimeout(() => {
          expect(device.measure).toHaveBeenCalledTimes(expectedCalls);
          done();
        }, interval * expectedCalls);
      }
    });
  });
});