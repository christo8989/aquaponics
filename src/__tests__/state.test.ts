import { DeviceObservable } from '~/devices/device-observable';
import { CountingDevice } from '~/devices/counting.device';
import { StateObservable, STATE_DEBOUNCE_TIME } from '~/state-observable';
import { ManualDevice } from '~/devices/manual.device';

describe('state', () => {
  const interval = 10;
  let observables: DeviceObservable[];

  beforeEach(() => {
    observables = [
      new DeviceObservable(new ManualDevice({ name: 'test1', value: 100, interval })),
      new DeviceObservable(new ManualDevice({ name: 'test2', value: 23, interval })),
    ];
  });

  afterEach(() => {
    observables = [];
  });

  it('should be a behavior subject', () => {
    const state = new StateObservable([]);
    expect(typeof state.subscribe).toBe('function');
    expect(typeof state.value).toBe('object');
    expect(typeof state.value).not.toBeFalsy();
  });

  it('should throw an error when devices have the same name', () => {
    const devices = [
      new DeviceObservable(new CountingDevice({ name: 'Test' })),
      new DeviceObservable(new CountingDevice({ name: 'Different' })),
      new DeviceObservable(new CountingDevice({ name: 'Test' })),
    ];
    const action = () => { new StateObservable(devices); };
    expect(action).toThrowError();
  });
  
  it(`should throw an error when device interval is equal to ${STATE_DEBOUNCE_TIME}`, () => {
    const devices = [
      new DeviceObservable(new CountingDevice({ name: 'Test', interval: STATE_DEBOUNCE_TIME })),
    ];
    const action = () => { new StateObservable(devices); };
    expect(action).toThrowError();
  });
  
  it(`should throw an error when device interval is less than ${STATE_DEBOUNCE_TIME}`, () => {
    const devices = [
      new DeviceObservable(new CountingDevice({ name: 'Test', interval: STATE_DEBOUNCE_TIME - 1 })),
    ];
    const action = () => { new StateObservable(devices); };
    expect(action).toThrowError();
  });

  it('devices should default to 0', () => {
    const state = new StateObservable(observables);
    const expected = { test1: 0, test2: 0 };
    expect(state.value).toEqual(expected);
  });

  it('devices should return their measured value', done => {
    const state = new StateObservable(observables);
    const expected = { test1: 100, test2: 23 };

    const unsubscribe = state.subscribe(state => {
      unsubscribe.unsubscribe();
      expect(state).toEqual(expected);
      done();
    });
  });

  it('should be subscribabble', done => {
    const state = new StateObservable(observables);
    const unsubscribe = state.subscribe(() => {
      unsubscribe.unsubscribe();
      done();
    });
  });
});