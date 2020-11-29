// import { TestScheduler } from 'rxjs/testing';
import { expect } from 'chai';
 
// const testScheduler = new TestScheduler((actual: any, expected: any) => {
//   // asserting the two objects are equal
//   // e.g. using chai.
//   expect(actual).deep.equal(expected);
// });
 
// // This test will actually run *synchronously*
// it('generate the stream correctly', () => {
//   testScheduler.run(helpers => {
//     const { cold, expectObservable, expectSubscriptions } = helpers;
//     const e1 =  cold('-a--b--c---|');
//     const subs =     '^----------!';
//     const expected = '-a-----c---|';
 
//     expectObservable(e1.pipe(throttleTime(3, testScheduler))).toBe(expected);
//     expectSubscriptions(e1.subscriptions).toBe(subs);
//   });
// });

describe('Tests', () => {
  it('should run', () => {
    expect('test').to.equal('foo');
    expect('test eslint').to.equal('test eslint');
  });
});