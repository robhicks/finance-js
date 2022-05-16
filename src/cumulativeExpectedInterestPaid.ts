import { interestPayments } from "./interestPayments";

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
export function cumulativeExpectedInterestPaid(
  amount = 0,
  rate = 0,
  periods = 0,
  start = null,
  end = null,
  type = 0
) {
  const startPeriod = start || 1;
  const endPeriod = end || periods;

  const presentValueBeforeStart =
    interestPayments(rate, startPeriod, amount, type) + amount;

  const result = interestPayments(
    rate,
    endPeriod - startPeriod,
    presentValueBeforeStart,
    type
  );

  return result;
}
