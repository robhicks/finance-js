/*
 firstPaymentDate
 ----------------
 This function calculates the first payment date of a loan. It defaults to
 the first day of the month which is at least one full month from the date
 the loan was funded (origination or funding date).

 This function takes the following arguments:
 * closingDate (required) - the funding or origination date of the loan
 * firstPaymentDay (optional) - desired day of the month for the payment - defaults to the first day
 */
function firstPaymentDate(closingDate = new Date(), firstPaymentDay = 1) {
  const oneMonthOut = new Date(closingDate.setMonth(closingDate.getMonth() + 1));
  const twoMonthsOut = new Date(closingDate.setMonth(closingDate.getMonth() + 2));
  const oneMonthOutDate = new Date(oneMonthOut.setDate(firstPaymentDay));
  const twoMonthsOutDate = new Date(twoMonthsOut.setDate(firstPaymentDay));
  console.log('twoMonthsOutDate.toDateString()', twoMonthsOutDate.toDateString());
  return closingDate.getDate() > 1 ? closingDate.setMonth(closingDate.getMonth() + 2) : closingDate.setMonth(closingDate.getMonth() + 1);
}

describe('firstPaymentDate()', () => {
  it('description', () => {
    const d = firstPaymentDate();
  });
});

/*
 numberOfPayments
 --------
 Calculates the number of payments for a loan. This is different than NPER.
 NPER calculates the number of periods used in an annuity or loan from
 a financial perspective. This function looks at how frequently a customer
 chooses to make payments. This function has the following arguments:
 * term: the number of periods used in calculating interest for a loan
 * frequency: the payment frequency, which can be any of the following:
 - semimonthly - twice a month
 - monthly - once each month
 - bimonthly - every two months
 - quarterly - every quarter
 - semiannually - ever 6 months
 - annually - ever 12 months
 - none or one - only one payment at the end of the loan - typically don't mix this with balloonDate
 */
function numberOfPayments(term = 0, frequency = 'monthly') {
  const freq = frequency.toLowerCase();
  let payments;
  if (freq === 'semimonthly') {
    (payments = parseInt(term * 2));
  } else if (freq === 'bimonthly') {
    payments = (parseInt(term / 2));
  } else if (freq === 'quarterly') {
    payments = (parseInt(term / 4));
  } else if (freq === 'semiannually') {
    payments = (parseInt(term / 6));
  } else if (freq === 'annually') {
    payments = (parseInt(term / 12));
  } else if (freq === 'none' || freq === 'one') {
    payments = 1;
  } else {
    payments = term;
  }
  return payments;
}

describe('numberOfPayments()', () => {
  it('should return 0 if no parameters are provided', () => {
    const payments = numberOfPayments();
    expect(payments).to.equal(0);
  });
  it('should return 12 if the term is twelve and the frequency is monthly', () => {
    const p = numberOfPayments(12);
    expect(p).to.equal(12);
  });
  it('should return 24 if the term is twelve and the frequency is semimonthly', () => {
    const p = numberOfPayments(12, 'semimonthly');
    expect(p).to.equal(24);
  });
  it('should return 6 if the term is twelve and the frequency is bimonthly', () => {
    const p = numberOfPayments(12, 'bimonthly');
    expect(p).to.equal(6);
  });
  it('should return 3 if the term is twelve and the frequency is quarterly', () => {
    const p = numberOfPayments(12, 'quarterly');
    expect(p).to.equal(3);
  });
  it('should return 2 if the term is twelve and the frequency is semiannually', () => {
    const p = numberOfPayments(12, 'semiannually');
    expect(p).to.equal(2);
  });
  it('should return 1 if the term is twelve and the frequency is annually', () => {
    const p = numberOfPayments(12, 'annually');
    expect(p).to.equal(1);
  });
  it('should return 1 if the term is twelve and the frequency is none or one', () => {
    const p = numberOfPayments(12, 'none');
    expect(p).to.equal(1);
    const p1 = numberOfPayments(12, 'one');
    expect(p1).to.equal(1);
  });
});

describe('pastDueAmount(loan)', () => {
  it('should', () => {
    // const ln = pastDueAmount(loan);
    // console.log(`ln`, ln)
  });
});

/*
 paymentAmount
 ---
 calculates the payment for a loan with the following parameters:
 * pv (required) - loan amount
 * nper (required) - the number of periods
 * rate (required) - the rate per period
 * interestOnly (optional) - boolean indicating if the loan is an interest only loan
 */
function paymentAmount(pv = 0, nper = 0, rate = 0, interestOnly = false) {
  if (interestOnly) return pv * nper * rate / nper;
  return  pv * (rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
}

describe('paymentAmount()', () => {
  it('should return NaN if no parameters are provided', () => {
    const a = paymentAmount();
    expect(a).to.be.NaN;
  });
  it('should return the proper payment for a pv of 1000, nper 12 and rate of 10% per annum', () => {
    const rate = 10 / 100 / 12;
    const a = paymentAmount(1000, 12, rate);
    expect(a).to.equal(87.91588723000989);
  });
  it('should return the interest only payment for a pv of 1000, nper 12 and rate of 10% per annum', () => {
    const rate = 10 / 100 / 12;
    const a = paymentAmount(1000, 12, rate, true);
    expect(a).to.equal(8.333333333333334);
  });
});

/*
 presentValueOfLumpSum
 -----------
 Calculates the present value of a lump sum received in the future. Params include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of periods
 * FV (required) - the future value or lump sum to be received
 */
function presentValueOfLumpSum(FV = 0, NPER = 0, rate = 0) {
  return FV / Math.pow(1 + rate, NPER);
}

describe('presentValueOfLumpSum()', () => {
  it('should return 0 if no parameters are provided', () => {
    const pv = presentValueOfLumpSum();
    expect(pv).to.equal(0);
  });
  it('should return the present value of $10000 received 60 periods in the future with a rate of .001', () => {
    const pv = presentValueOfLumpSum(10000, 60, .001);
    expect(pv).to.equal(9417.927681223207);
  });
});
