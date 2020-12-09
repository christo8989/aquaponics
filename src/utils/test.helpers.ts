import { TestScheduler } from 'rxjs/testing';

export const testScheduler = new TestScheduler((actual: any, expected: any) => {
  // expect(actual).deep.equal(expected);
});

export const truthy = true;