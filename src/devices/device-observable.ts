import { Observable, Subscriber, TeardownLogic } from 'rxjs';
import { Device } from '~/devices/device';

interface DeviceObservableConfiguration {
  interval: number;
}

export class DeviceObservable extends Observable<number> {
  private _intervalId!: NodeJS.Timeout;

  constructor(
    public device: Device,
    private _options: DeviceObservableConfiguration,
  ) {
    super((subscriber: Subscriber<number>): TeardownLogic => {
      this._intervalId = setInterval(() => {
        this.device.measure()
          .then(subscriber.next.bind(subscriber))
          // TODO: error log
          .catch(error => console.log(error));
      }, this._options.interval);

      return () => {
        clearInterval(this._intervalId);
      };
    });
  }
}