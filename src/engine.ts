import { isObservable, Subscription } from 'rxjs';
import { Device } from './devices/device';
import { DeviceObservable } from './devices/device-observable';
import { State } from './state';

export class Engine {
  private observables: DeviceObservable[];
  private state: State;
  private subscription: Subscription | null;

  constructor(devices: (Device | DeviceObservable)[]) {
    this.observables = devices.map(
      device => isObservable(device) ? device : new DeviceObservable(device),
    );
    this.state = new State(this.observables);
    this.subscription = null;
  }

  start() {
    this.subscription?.unsubscribe();
    this.subscription = this.state.subscribe();
  }

  stop() {
    this.subscription?.unsubscribe();
  }

}