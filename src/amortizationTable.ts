import { addMonths } from "./addMonths";
import { numberOfPayments } from "./numberOfPayments";

/*
 generateAmortizationTable
 -----------------------
 This function generates an amortization schedule. The schedule is returned as a Javascript object.

 The function accepts the following arguments:
 * PV (required): the starting principal amount of the loan
 * NPER (required): the number of whole months over which the loan extends
 * rate (required): the annual interest rate of the loan expressed as a percentage, e.g., 10.5
 * firstPaymentDate (optional): the date the first payment will be made
 * frequency (optional): the payment frequency, which can be any of the following strings:
 - semimonthly - twice a month
 - monthly - once each month
 - bimonthly - every two months
 - quarterly - every quarter
 - semiannually - ever 6 months
 - annually - ever 12 months
 - none or one - only one payment at the end of the loan - typically don't mix this with balloonDate
 * balloonDate (optional/required): the date a balloon payment will be made. This date will be forced to earliest
 corresponding payment date. This date will be ignored if it is greater than the term (months) of the
 loan.

 The function returns an array with each array element containing the following fields:
 * paymentNumber - the number for a payment
 * principle: the principal balance remaining at the end of the period
 * accumulatedInterest: the interest accumulate from all previous periods through this period
 * payment: the periodic payment the borrower is required to pay
 * paymentToPrinciple: the amount of the payment allocated to paying down the principal
 * paymentToInterest: the amount of the payment allocated to paying interest
 * date: the date of the payment for the period

 */
export function addAmorizationTable({
  balloonDate = new Date(),
  firstPaymentDate = new Date(),
  frequency = "monthly",
  interestRate = 0,
  loanAmount = 0,
  payment = 0,
  term = 0,
  type = 0,
} = {}) {
  const currDate = firstPaymentDate;
  const dateOffset = 1;
  const lastPaymentDate = addMonths(currDate, term + 1);
  const paymentDay = new Date(currDate);
  const payments = numberOfPayments(term, frequency);
  const semimonthly = false;
  const schedule = [];
  const totalInterest = 0.0;
  let currInterest = 0;
  let currPrinciple = 0;
  let tempDate,
    tempDay,
    balloonPeriod,
    balloonAmount,
    startingPrincipal,
    balance;

  if (balloonDate) {
    if (balloonDate > lastPaymentDate || balloonDate < currDate) {
      throw new SyntaxError(
        "balloon date must be after first payment date and before last payment date"
      );
    } else {
      tempDate = new Date(firstPaymentDate);
      tempDay = tempDate.getDate();

      for (let a = 0; a < payments; a++) {
        if (semimonthly) {
          if (a.isOdd()) {
            tempDate.add("d", dateOffset);
            tempDate.date(tempDay);
          } else {
            tempDate.add("d", dateOffset);
          }
        } else {
          tempDate.add("M", dateOffset);
        }
        balloonPeriod =
          !balloonDate.isAfter(tempDate) && !balloonDate.isBefore(tempDate)
            ? a
            : term;
      }
    }
    balloonAmount = calculator.BalloonLoan(
      loanAmount,
      interestRate,
      payments,
      null,
      balloonPeriod,
      type
    ).balloonAmount;
  }

  loan.payments = payments;
  payment = loan.paymentAmount;
  balance = loanAmount;
  startingPrincipal = loanAmount;

  for (let i = 0; i < payments; i++) {
    currInterest = balance * interestRate;
    currPrinciple = payment - currInterest;
    balance -= currPrinciple;
    if (i === balloonPeriod) {
      payment = payment + balloonAmount + currInterest;
      currPrinciple = payment;
      balance = 0;
    }

    schedule.push({
      paymentNumber: i + 1,
      startintPrincipal: startingPrincipal,
      loanBalance: balance,
      amount: payment,
      principal: currPrinciple,
      interest: currInterest,
      txDate: currDate.toISOString(),
    });

    startingPrincipal -= currPrinciple;

    if (i === balloonPeriod) break;

    if (semimonthly) {
      if (i.isOdd()) {
        currDate.add("d", dateOffset);
        currDate.date(paymentDay);
      } else {
        currDate.add("d", dateOffset);
      }
    } else {
      currDate.add("M", dateOffset);
    }
  }
  loan.amortizationTable = schedule;
  if (cb) return cb(loan);
  d.resolve(loan);
  return d.promise;
}
