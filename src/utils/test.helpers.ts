import { TestScheduler } from 'rxjs/testing';

export const testScheduler = new TestScheduler((actual: any, expected: any) => {
  console.log(expected);
  console.log(actual);
  expect(actual).toEqual(expected);
});

export const truthy = true;