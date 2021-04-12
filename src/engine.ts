import { isObservable, PartialObserver, Subscription } from 'rxjs';
import { Device } from './devices/device';
import { DeviceObservable } from './devices/device-observable';
import { State, StateObservable } from './state-observable';

interface Configuration {
  devices: (Device | DeviceObservable)[],
  observer: PartialObserver<State>,
}

export class Engine {
  private observables: DeviceObservable[];
  private state: StateObservable;
  private subscription: Subscription | null;
  private observer: PartialObserver<State>

  constructor(options: Configuration) {
    const { devices, observer } = options;
    this.observables = devices.map(
      device => isObservable(device) ? device : new DeviceObservable(device),
    );
    this.state = new StateObservable(this.observables);
    this.subscription = null;
    this.observer = observer;
  }

  start() {
    this.subscription?.unsubscribe();
    this.subscription = this.state.subscribe(this.observer);
  }

  stop() {
    this.subscription?.unsubscribe();
  }

}