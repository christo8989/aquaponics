import { Observable, combineLatest, Subscriber, TeardownLogic, Subscription } from 'rxjs';
import { map, skip, startWith, debounceTime } from 'rxjs/operators';
import { DeviceObservable } from '~/devices/device-observable';
import { Device } from './devices/device';
import { curry } from './utils/function.helpers';

export interface State {
  [key: string]: number;
}

type T = State;

/** Time in milliseconds */
export const STATE_DEBOUNCE_TIME = 1;

const manyToState = curry(
  (devices$: DeviceObservable[], values: number[]): T =>
    devices$.reduce(toState(values || []), {}),
);

const toState = (values: number[]) => (state: T, device$: DeviceObservable, index: number): T => {
  const value = values[index] || 0;
  state[device$.name] = value;
  return state;
};


const validate = (devices: Device[]) => {
  const names = {} as unknown;
  devices.forEach(({ name }) => names[name] = name);
  if (Object.keys(names).length < devices.length) {
    throw new Error(`There are two devices with the same name. [${devices.map(({ name }) => name)}]`);
  }

  if (devices.some(device => device.interval <= STATE_DEBOUNCE_TIME)) {
    throw new Error(`The interval must be above ${STATE_DEBOUNCE_TIME} milliseconds.`);
  }
};

export class StateObservable extends Observable<T> {
  private numberOfObservers = 0
  private subscription: Subscription | null
  private state$: Observable<T>
  private _value: T;

  constructor(devices: DeviceObservable[]) {
    super((subscriber: Subscriber<T>): TeardownLogic => {
      if (this.numberOfObservers < 1) {
        this.subscription?.unsubscribe();
        this.subscription = this.state$.subscribe(state => this._value = state);
      }

      const subscription = this.state$.pipe(skip(1)).subscribe(subscriber);
      this.numberOfObservers++;
      return () => {
        this.numberOfObservers--;
        subscription.unsubscribe();
        
        if (this.numberOfObservers < 1) {
          this.subscription?.unsubscribe();
        }
      };
    });

    validate(devices);

    this.state$ = combineLatest(
      devices.map(device$ => device$.pipe(startWith(0))),
    ).pipe(
      debounceTime(STATE_DEBOUNCE_TIME),
      map(manyToState(devices)),
    );
    this._value = manyToState(devices, []);
    this.subscription = null;
  }

  get value(): T {
    return this._value;
  }
}