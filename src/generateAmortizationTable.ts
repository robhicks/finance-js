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
export function generateAmortizationTable(loan, cb) {
  var d = Q.defer();
  if (!loan) d.reject("loan object not provided");
  else if (!loan.loanAmount) d.reject("loan amount missing");
  else if (!loan.term) d.reject("loan term missing");
  else if (!loan.interestRate) d.reject("interest rate not provided");
  else if (!loan.firstPaymentDate) d.reject("first payment date missing");
  else if (!loan.paymentAmount) d.reject("missing loan payment amount");
  else {
    var loanAmount = Number(loan.loanAmount);
    var term = Number(loan.term);
    var interestRate = Number(loan.interestRate) / 100;
    var frequency = String(loan.frequency).toLowerCase();
    var type = loan.type && !_.isEmpty(loan.type) ? Number(loan.type) : 0;
    var currDate = moment(loan.firstPaymentDate);
    var dateOffset = 1;
    var lastPaymentDate = currDate.clone().add("M", term);
    var paymentDay = currDate.date();
    var payments = 0;
    var semimonthly = false;
    var balloonDate = loan.balloonDate ? moment(loan.balloonDate) : null;
    var schedule = [];
    var totalInterest = 0.0;
    var currInterest = 0;
    var currPrinciple = 0;
    var tempDate,
      tempDay,
      balloonPeriod,
      balloonAmount,
      payment,
      startingPrincipal,
      balance;

    switch (frequency) {
      case "semimonthly":
        payments = term * 2;
        interestRate = interestRate / 12 / 2;
        semimonthly = true;
        dateOffset = parseInt(365.25 / 12 / 2);
        break;
      case "bimonthly":
        payments = term / 2;
        interestRate = (interestRate / 12) * 2;
        dateOffset = 2;
        break;
      case "quarterly":
        payments = term / 4;
        interestRate = (interestRate / 12) * 4;
        dateOffset = 4;
        break;
      case "semiannually":
        payments = term / 6;
        interestRate = (interestRate / 12) * 6;
        dateOffset = 6;
        break;
      case "annually":
        payments = term / 12;
        interestRate = (interestRate / 12) * 12;
        dateOffset = 12;
        break;
      default:
        payments = term;
        interestRate = interestRate / 12;
        dateOffset = 1;
        break;
    }

    if (balloonDate) {
      if (
        balloonDate.isAfter(lastPaymentDate) ||
        balloonDate.isBefore(currDate)
      ) {
        d.reject(
          new Error(
            "balloon date must be after first payment date and before last payment date"
          )
        );
      } else {
        tempDate = moment(firstPaymentDate);
        tempDay = tempDate.date();

        for (var a = 0; a < payments; a++) {
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

    for (var i = 0; i < payments; i++) {
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
  }
  return d.promise;
}
