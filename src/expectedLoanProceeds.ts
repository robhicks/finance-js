import { cumulativeExpectedInterestPaid } from "./cumulativeExpectedInterestPaid";
import { daysBetween } from "./daysBetween";
import { monthsBetween } from "./monthsBetween";
import { numberOfPayments } from "./numberOfPayments";
import { remainingBalance } from "./remainingBalance";
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

export function expectedLoanProceeds({
  amount = 0,
  rate = 0,
  term = 0,
  payments = 0,
  payment = 0,
  prepaidInterest = 0,
  frequency = "monthly",
  closingDate = new Date(),
  firstPaymentDate = new Date(),
  determinationDate = new Date(),
} = {}) {
  const daysBeforeFirstPayment = daysBetween(closingDate, firstPaymentDate);
  const periodicRate = rate / 100 / ((12 * payments) / term);
  const dailyRate = rate / 100 / 365;
  const interestEarnedBeforeFirstPayment =
    daysBeforeFirstPayment * amount * dailyRate - prepaidInterest;
  const numberOfMonths = monthsBetween(firstPaymentDate, determinationDate);
  const numberOfExtraDays =
    daysBetween(firstPaymentDate, determinationDate) - numberOfMonths * 30;
  const np = numberOfPayments(numberOfMonths, frequency);

  const cumInterestPaid = cumulativeExpectedInterestPaid(
    amount,
    periodicRate,
    term
  );
  const rb = remainingBalance({
    originalAmount: amount,
    payment,
    rate: periodicRate,
    payments: np,
  });
  const interestEarnedAfterLastPayment = numberOfExtraDays * rb * dailyRate;
  const expectedProceeds =
    interestEarnedBeforeFirstPayment +
    cumInterestPaid +
    amount -
    rb +
    interestEarnedAfterLastPayment;

  return expectedProceeds;
}
