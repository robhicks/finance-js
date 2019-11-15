import { remainingBalance } from './remainingBalance.js';

describe('remainingBalance()', () => {
  it('should return the original amount if no payments have been made', () => {
    const props = {
      originalAmount: 1000,
      payment: 100,
      rate: 10 / 100 / 12,
      payments: 0
    }
    const rb = remainingBalance(props);
    expect(rb).to.equal(1000);
  });
});
