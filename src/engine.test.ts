import { testScheduler } from "~/utils/test.helpers";
import { throttleTime } from 'rxjs/operators'
import { expect } from "chai";

describe('engine', () => {
  // This test will actually run *synchronously*
  // it('generate the stream correctly', () => {
  //   testScheduler.run((helpers: any) => {
  //     const { cold, expectObservable, expectSubscriptions } = helpers;
  //     const e1 = cold('-a--b--c---|');
  //     const subs = '^----------!';
  //     const expected = '-a-----c---|';

  //     expectObservable(e1.pipe(throttleTime(3, testScheduler))).toBe(expected);
  //     expectSubscriptions(e1.subscriptions).toBe(subs);
  //   });
  // });

  it('does this finis for trueh', () => {
    expect(true).to.true;
  })

  it('does this finish', () => {
    expect(!!testScheduler).to.true;
  })
});