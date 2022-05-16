/*
   EarnedAmount
   ------------
   This function calculates the amount that should have been received for a loan at a specified
   date in the future.

   This function takes a Javascript object. The Javascript object should
   include the following:

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

export function earnedAmount(loan, cb) {
  var deferred = Q.defer();
  if (
    !loan ||
    !loan.loanAmount ||
    !loan.closingDate ||
    !loan.firstPaymentDate ||
    !loan.interestRate ||
    !loan.term ||
    !loan.payments ||
    !loan.determinationDate ||
    !loan.paymentAmount
  ) {
    deferred.reject(
      new Error("earnedAmount cannot be calculated without required parameters")
    );
  } else {
  }

  var InitialLoanAmount = Number(loan.loanAmount);
  var OriginationDate = moment(loan.closingDate);
  var FirstPaymentDate = moment(loan.firstPaymentDate);
  var Term = loan.term;
  var Frequency = loan.frequency ? loan.frequency : "monthly";
  var Payments = Number(loan.payments);
  var Rate = Number(loan.interestRate);
  var DeterminationDate = moment(loan.determinationDate);
  var daysBeforeFirstPayment = FirstPaymentDate.diff(OriginationDate, "days");
  var periodicRate = Rate / 100 / ((12 * Payments) / Term);
  var dailyRate = Rate / 100 / 365;
  var InterestPrepaymentAmount = loan.prepaidInterest
    ? Number(loan.prepaidInterest)
    : 0;
  var interestEarnedBeforeFirstPayment =
    daysBeforeFirstPayment * InitialLoanAmount * dailyRate -
    InterestPrepaymentAmount;
  var numberOfMonths = DeterminationDate.diff(FirstPaymentDate, "months");
  var numberOfExtraDays =
    DeterminationDate.diff(FirstPaymentDate, "days") - numberOfMonths * 30;
  var Payment = Number(loan.paymentAmount);
  cumulativeInterestPaid(loan);
  var cumInterestPaid = this.cumulativeInterestPaid(
    loan,
    Payments,
    InitialLoanAmount
  );

  var remainingBalance = calculator.RemainingBalance(
    InitialLoanAmount,
    periodicRate,
    numberOfMonths,
    Payment
  );
  var interestEarnedAfterLastPayment =
    numberOfExtraDays * remainingBalance * dailyRate;
  var totalAmountEarned =
    interestEarnedBeforeFirstPayment +
    cumInterestPaid +
    InitialLoanAmount -
    remainingBalance +
    interestEarnedAfterLastPayment;

  deferred.resolve(totalAmountEarned);
  if (cb) return cb(loan);
  return deferred.promise;
}
