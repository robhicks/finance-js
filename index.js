'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function pastDueAmount(loan) {
  const now = new Date();
  const paymentsDue = loan.amortizationTable.filter(tx => new Date(tx.txDate) < now);
  const paymentsMade = loan.translations.filter(tx => new Date(tx.txDate) < now && tx.type !== 'Late Fee');

  const sumPaymentsDue = paymentsDue.reduce((agg, pmt) => agg += Number(pmt.amount), 0);
  const sumPaymentsMade = paymentsMade.reduce((agg, pmt) => agg += Number(pmt.amount), 0);

  loan.pastDueAmount = sumPaymentsDue - sumPaymentsMade;

  return loan;
}

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

exports.numberOfPayments = numberOfPayments;
exports.pastDueAmount = pastDueAmount;
exports.presentValueOfLumpSum = presentValueOfLumpSum;
