import { Observable, Subject, Subscriber, TeardownLogic, isObservable } from 'rxjs';
import { Device } from '~/devices/device';
import { available } from '~/utils/array.helpers';

type T = number;

const validate = (device: unknown) => {
  if (isObservable(device)) {
    throw new Error('You cannot give the DeviceObservable another Observable.');
  }
};

export class DeviceObservable extends Observable<T> implements Device {
  private subject = new Subject<T>();
  private intervalId: NodeJS.Timeout | undefined;

  constructor(private device: Device) {
    super((subscriber: Subscriber<T>): TeardownLogic => {
      if (!available(this.subject.observers)) {
        this.clearInterval();

        this.intervalId = setInterval(() => {
          this.device.measure()
            .then(this.subject.next.bind(this.subject))
            // TODO: error log
            .catch(console.error);
        }, device.interval);
      }

      const subscription = this.subject.subscribe(subscriber);

      return () => {
        subscription.unsubscribe();
        this.clearInterval();
      };
    });

    validate(device);
  }

  get name(): string {
    return this.device.name;
  }

  get interval(): number {
    return this.device.interval;
  }

  measure(): Promise<number> {
    return this.device.measure();
  }

  private clearInterval(): void {
    if (this.intervalId && !available(this.subject.observers)) {
      clearInterval(this.intervalId);
      delete this.intervalId;
    }
  }
}
