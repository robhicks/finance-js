'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function daysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = new Date(year, month, 0).getDate();
  return days;
}

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

exports.cumulativeExpectedInterestPaid = cumulativeExpectedInterestPaid;
exports.daysBetween = daysBetween;
exports.daysInMonth = daysInMonth;
exports.firstPaymentDate = firstPaymentDate;
exports.interestPayments = interestPayments;
exports.numberOfPayments = numberOfPayments;
exports.pastDueAmount = pastDueAmount;
exports.presentValueOfLumpSum = presentValueOfLumpSum;
