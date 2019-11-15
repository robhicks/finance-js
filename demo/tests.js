function interestPayments(rate = 0, nper = 0, pv = 0, type = 0) {
  return type === 1
    ? (pv * (Math.pow(1 + rate, nper) - 1)) * (1 + rate)
    : pv * (Math.pow(1 + rate, nper) - 1);
}

/*
 cumulativeExpectedInterestPaid
 ----------------------
 Calculate the total interest paid on a loan in specified periodic payments. Arguments include:
 * rate (required) - interest rate specified as a percentage, e.g., 10.5
 * periods (required) - the total number of payment periods in the term
 * amount (required) - the initial sum borrowed
 * start (optional) - the first period to include. Periods are numbered beginning with 1
 * end (optional) - the last period to include
 * type (optional) - whether payments are made at the end of each period (0) or at the start of each period (1)
 */
function cumulativeExpectedInterestPaid(amount = 0, rate = 0, periods = 0, start = null, end = null, type = 0) {
  const startPeriod = start || 1;
  const endPeriod = end || periods;

  const presentValueBeforeStart = interestPayments(rate, startPeriod, amount, type) + amount;

  const result = interestPayments(rate, endPeriod - startPeriod, presentValueBeforeStart, type);

  return result;
}

describe('cumulativeExpectedInterestPaid()', () => {
  it('should return 0 if no parameters are supplied', () => {
    const cip = cumulativeExpectedInterestPaid();
    expect(cip).to.equal(0);
  });
  it('should return 0 if no parameters are supplied', () => {
    const amount = 1000;
    const rate = 10 / 100 /12;
    const periods = 12;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods);
    expect(cip).to.equal(96.37973410796363);
  });

  it('should return 0 if no parameters are supplied', () => {
    const amount = 1000;
    const rate = 10 / 100 /12;
    const periods = 12;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods);
    expect(cip).to.equal(96.37973410796363);
  });
  it('should return 0 if no parameters are supplied', () => {
    const amount = 1000;
    const rate = 10 / 100 /12;
    const periods = 12;
    const start = 6;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods, start);
    expect(cip).to.equal(53.659754121131876);
  });
  it('should return 0 if no parameters are supplied', () => {
    const amount = 1000;
    const rate = 10 / 100 /12;
    const periods = 12;
    const start = 6;
    const end = 8;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods, start, end);
    expect(cip).to.equal(17.59054503542771);
  });
});

function treatAsUTC(date) {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const adjustedStartDate = treatAsUTC(startDate);
  const adjustedEndDate = treatAsUTC(endDate);
  const diff = adjustedEndDate - adjustedStartDate;
  const days = diff / millisecondsPerDay;
  return Math.abs(days);
}

describe('daysBetween()', () => {
  describe('treatAsUTC()', () => {
    it('should adjust date for timezone', () => {
      const date = new Date('January 1, 2019');
      const r = treatAsUTC(date).toDateString();
      expect(r).to.contain('Dec');
      expect(r).to.contain('31');
      expect(r).to.contain('2018');
    });
    it('should adjust another date for timezone', () => {
      const date = new Date('January 2, 2019');
      const r = treatAsUTC(date).toDateString();
      expect(r).to.contain('Jan');
      expect(r).to.contain('01');
      expect(r).to.contain('2019');
    });
  });

  describe('daysBetween()', () => {
    it('should return 0 if the dates are the same', () => {
      const startDate = new Date();
      const endDate = new Date();
      const db = daysBetween(startDate, endDate);
      expect(db).to.equal(0);
    });
    it('should return 1 if the dates differ by a day', () => {
      const startDate = new Date('December 31, 2019');
      const endDate = new Date('January 1, 2020');
      const db = daysBetween(startDate, endDate);
      expect(db).to.equal(1);
    });
    it('should return 1 if the dates differ by a day, even if the start day and end days are reversed', () => {
      const startDate = new Date('December 31, 2019');
      const endDate = new Date('January 1, 2020');
      const db = daysBetween(endDate, startDate);
      expect(db).to.equal(1);
    });
    it('should return 31 if the dates differ by a month', () => {
      const startDate = new Date('December 31, 2019');
      const endDate = new Date('January 31, 2020');
      const db = daysBetween(startDate, endDate);
      expect(db).to.equal(31);
    });
  });
});

function daysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = new Date(year, month, 0).getDate();
  return days;
}

describe('daysInMonth()', () => {
  it('return the number of days of January 2020', () => {
    const date = new Date('January 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it('return the number of days of February 2019', () => {
    const date = new Date('February 1, 2019');
    const d = daysInMonth(date);
    expect(d).to.equal(28);
  });
  it('return the number of days of February 2020', () => {
    const date = new Date('February 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(29);
  });
  it('return the number of days of March 2020', () => {
    const date = new Date('March 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it('return the number of days of April 2020', () => {
    const date = new Date('April 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it('return the number of days of May 2020', () => {
    const date = new Date('May 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it('return the number of days of June 2020', () => {
    const date = new Date('June 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it('return the number of days of July 2020', () => {
    const date = new Date('July 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it('return the number of days of August 2020', () => {
    const date = new Date('August 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it('return the number of days of September 2020', () => {
    const date = new Date('September 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it('return the number of days of October 2020', () => {
    const date = new Date('October 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it('return the number of days of November 2020', () => {
    const date = new Date('November 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it('return the number of days of December 2020', () => {
    const date = new Date('December 1, 2020');
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
});

function monthsBetween(startDate, endDate) {
  const days = daysBetween(startDate, endDate);
  const months = parseInt(days / 30, 10);
  return Math.abs(months);
}

function presentValueOfAnnuity({ payment = 0, rate = 0, payments = 0 } = {}) {
  return payment * ((1 - Math.pow(1 + rate, -payments)) / rate);
}

function remainingBalance({ originalAmount = 0, payment = 0, rate = 0, payments = 0 } = {}) {
  const fvOfOrig = originalAmount * Math.pow(1 + rate, payments);
  const fvOfAnn = presentValueOfAnnuity({ payment, rate, payments });
  return fvOfOrig - fvOfAnn;
}

/*
 expectedLoanProceeds
 ------------
 This function calculates the amount that should have been received for a loan at a specified
 date in the future.

 * loanAmount - the loan amount due when the loan was originated and closed
 * closingDate - the date when the loan was originated and closed
 * prepaidInterest (optional) - the amount paid on the OriginationDate to prepay interest on
 the loan up to the FirstPaymentDate or before.
 * firstPaymentDate - the date the first payment should have been received
 * interestRate - the annual interest rate
 * paymentAmount - the amount of the periodic payments
 * term - the term of the loan in months
 * payments - the number of payments to be paid during the Term
 * determinationDate - the date when the earnedAmount is calculated
 * frequency (optional) - the periodicity of the loan, e.g., 'monthly', 'quarterly', etc.
 */

function expectedLoanProceeds({
  amount = 0,
  rate = 0,
  term = 0,
  payments = 0,
  payment = 0,
  prepaidInterest = 0,
  frequency = 'monthly',
  closingDate = new Date(),
  firstPaymentDate = new Date(),
  determinationDate = new Date()
} = {}) {

  const daysBeforeFirstPayment = daysBetween(closingDate, firstPaymentDate);
  const periodicRate = rate / 100 / (12 * payments / term);
  const dailyRate = rate / 100 / 365;
  const interestEarnedBeforeFirstPayment = daysBeforeFirstPayment * amount * dailyRate - prepaidInterest;
  const numberOfMonths = monthsBetween(firstPaymentDate, determinationDate);
  const numberOfExtraDays = daysBetween(firstPaymentDate, determinationDate) - numberOfMonths * 30;

  const cumInterestPaid = cumulativeExpectedInterestPaid(amount, periodicRate, term);

  const rb = remainingBalance(amount);
  const interestEarnedAfterLastPayment = numberOfExtraDays * rb * dailyRate;
  const expectedProceeds = interestEarnedBeforeFirstPayment + cumInterestPaid + amount - rb + interestEarnedAfterLastPayment;

  return expectedProceeds;
}

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
    console.log(`e`, e);
  });
});

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
  const cd = closingDate.getDate();
  const om = new Date(closingDate);
  om.setMonth(om.getMonth() + 1);
  om.setDate(firstPaymentDay);
  if (cd > 1) {
    if (daysBetween(closingDate, om) > 30) return om;
    else {
      om.setMonth(om.getMonth() + 1);
      return om;
    }
  }
  return om;

}

describe('firstPaymentDate()', () => {
  it('should return January 1, 2020', () => {
    const firstPaymentDay = 1;
    const closingDate = new Date('November 14, 2019 03:24:00');
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain('Jan');
    expect(d).to.contain('1');
    expect(d).to.contain('2020');
  });
  it('should return December 1, 2019', () => {
    const firstPaymentDay = 1;
    const closingDate = new Date('November 1, 2019 03:24:00');
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain('Dec');
    expect(d).to.contain('1');
    expect(d).to.contain('2019');
  });
  it('should return January 1, 2020', () => {
    const firstPaymentDay = 1;
    const closingDate = new Date('November 30, 2019 03:24:00');
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain('Jan');
    expect(d).to.contain('1');
    expect(d).to.contain('2020');
  });
  it('should return February 1, 2020', () => {
    const firstPaymentDay = 1;
    const closingDate = new Date('December 31, 2019 03:24:00');
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain('Feb');
    expect(d).to.contain('1');
    expect(d).to.contain('2020');
  });
});

describe('interestPayments()', () => {
  it('should return 0 if no payments have been made', () => {
    const ip = interestPayments();
    expect(ip).to.equal(0);
  });
  it('should return the interest payments made at the end of each period', () => {
    const rate = 10 / 100 / 12;
    const periods = 12;
    const amount = 1000;
    const ip = interestPayments(rate, periods, amount);
    expect(ip).to.equal(104.71306744129683);
  });

  it('should return the interest payments made at the beginning of each period', () => {
    const rate = 10 / 100 / 12;
    const periods = 12;
    const amount = 1000;
    const ip = interestPayments(rate, periods, amount, 1);
    expect(ip).to.equal(105.58567633664097);
  });
});

describe('monthsBetween()', () => {
  it('should return 0 if the dates are the same', () => {
    const startDate = new Date();
    const endDate = new Date();
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(0);
  });
  it('should return 1 if the dates differ by a month', () => {
    const startDate = new Date('December 31, 2019');
    const endDate = new Date('January 31, 2020');
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(1);
  });
  it('should return 1 if the dates differ by a month and a half', () => {
    const startDate = new Date('December 31, 2019');
    const endDate = new Date('February 15, 2020');
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(1);
  });
  it('should return 1 if the dates differ by a month, even if the start date and end date are reversed', () => {
    const startDate = new Date('December 31, 2019');
    const endDate = new Date('January 31, 2020');
    const mb = monthsBetween(endDate, startDate);
    expect(mb).to.equal(1);
  });
  it('should return 12 if the dates differ by a year', () => {
    const startDate = new Date('December 31, 2020');
    const endDate = new Date('December 31, 2021');
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(12);
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

describe('presentValueOfAnnuity()', () => {
  it('should return a discounted value', () => {
    const payment = 1;
    const rate = 10 / 100 /12;
    const payments = 12;
    const pv = presentValueOfAnnuity({ payment, rate, payments});
    expect(pv).to.equal(11.374508425124015);
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

describe('remainingBalance()', () => {
  it('should return the original amount if no payments have been made', () => {
    const props = {
      originalAmount: 1000,
      payment: 100,
      rate: 10 / 100 / 12,
      payments: 0
    };
    const rb = remainingBalance(props);
    expect(rb).to.equal(1000);
  });
});
