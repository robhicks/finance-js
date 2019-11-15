import {expectedLoanProceeds} from './expectedLoanProceeds.js';

describe.only('expectedLoanProceeds()', () => {
  it('description', () => {
    const props = {
      amount: 1000,
      rate: 10,
      term: 12,
      payments: 12,
      payment: 100
    };
    const e = expectedLoanProceeds(props);
    console.log(`e`, e)
  });
});
