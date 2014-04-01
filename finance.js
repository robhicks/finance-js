"use strict";

(function (window) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    var Q = require('q');
    var _ = require('lodash');
    var util = require('util');
    var moment = require('moment');
    module.exports = new FinanceJs();
  } else if (typeof angular !== 'undefined' && typeof angular.module !== 'undefined') {
    angular.module('FinanceJs', []);

  } else {
    window.FinanceJs = FinanceJs;
  }

  function FinanceJs() {

    this.presentValueOfLumpsump = presentValueOfLumpsump;
    this.numberOfPayments = numberOfPayments;
    this.paymentAmount = paymentAmount;
    this.firstPaymentDate = firstPaymentDate;
    this.generateAmortizationTable = generateAmortizationTable;
    this.isLoanPastDue = isLoanPastDue;
    this.earnedAmount = earnedAmount;
    this.cumulativeInterestPaid = cumulativeInterestPaid;

  }

  /*
   presentValueOfLumpsump
   -----------
   Calculates the present value of a lump sum received in the future. Params include:
   * rate (required) - the interest rate per period
   * NPER (required) - total number of periods
   * FV (required) - the future value or lump sum to be received
   */
  function presentValueOfLumpsump(params, cb) {
    var d = Q.defer();
    if (!params || _.isEmpty(loan.rate) || _.isEmpty(loan.NPER) || _.isEmpty(loan.FV)) {
      d.reject(new Error('params object not provided or params does not include rate, NPER and FV'))
    } else {
      var result = FV / Math.pow(1 + rate, NPER);
      d.resolve(result);
    }
    if (callback) return d.promise.nodeify(callback);
    return d.promise;
  }

  /*
   Payments
   --------
   Calculates the number of payments for a loan. This is different than NPER.
   NPER calculates the number of periods used in an annuity or loan from
   a financial perspective. This function looks at how frequently a customer
   chooses to make payments. This function has the following arguments within params:
   * term (required) - the number of periods used in calculating interest for a loan
   * frequency (required): the payment frequency, which can be any of the following:
   - semimonthly - twice a month
   - monthly - once each month
   - bimonthly - every two months
   - quarterly - every quarter
   - semiannually - ever 6 months
   - annually - ever 12 months
   - none or one - only one payment at the end of the loan - typically don't mix this with balloonDate
   * callback (optional) - function of CommonJs/NodeJs return, e.g., function(err, result)

   */
  function numberOfPayments(loan, callback) {
    var d = Q.defer();
    var payments;
    if (!loan || !loan.term || !loan.frequency) {
      d.reject(new Error('improper parameters'));
    } else {
      var frequency = loan.frequency.toLowerCase();
      var term = loan.term ? Number(loan.term) : 0;

      if (frequency == null || frequency === 'monthly') {
        payments = term;
      } else if (frequency === 'semimonthly') {
        (payments = term * 2).toInteger();
      } else if (frequency === 'bimonthly') {
        payments = (term / 2).toInteger();
      } else if (frequency === 'quarterly') {
        payments = (term / 4).toInteger();
      } else if (frequency === 'semiannually') {
        payments = (term / 6).toInteger();
      } else if (frequency === 'annually') {
        payments = (term / 12).toInteger();
      } else if (frequency === 'none' || frequency === 'one') {
        payments = 1;
      }

      d.resolve(payments);
      if (callback) return d.promise.nodeify(callback);
      return payments;
    }
  }

  /*
   paymentAmount
   ---
   calculates the payment for a loan with the following parameters:
   * loanAmount (required) - loan amount
   * NPER (required) - the number of periods
   * rate (required) - the rate per period
   * interestOnly (optional) - boolean indicating if the loan is an interest only loan
   * type (optional) - whether the payment is made at the beginning (1) or the end (0) of a period
   */
  function paymentAmount(loan, callback) {
    var d = Q.defer();
    if (!loan || !loan.loanAmount || !loan.term || !loan.interestRate) {
      d.reject(new Error('required parameters not provided'));
    } else {

    }
    try {
      var interestRate = loan.interestRate ? Number(loan.interestRate) / 1200 : 0;
      var term = loan.term ? Number(loan.term) : 0;
      var loanAmount = loan.loanAmount ? Number(loan.loanAmount) : 0;
      var type = loan.type != null ? Number(loan.type) : 0;
      var interestOnly = loan.interestOnly ? Boolean(loan.interestOnly) : false;

      term = type === 0 ? term : term + 1;

      // If the interest interestRate is 0, return loanAmount / term
      // If the interest interestRate is greater than 0 and the loan is an interest only loan, return

      var result;

      if (interestRate === 0) {
        if (term > 0) {
          result = loanAmount / term;
        } else {
          result = 0;
        }
      } else {
        if (interestOnly) {
          result = (loanAmount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1)) - loanAmount;
        } else {
          result = loanAmount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1);
        }
      }

      d.resolve(result);
      if (callback) return d.promise.nodeify(callback);
      return result;
    } catch (err) {
      d.reject(err);
      if (callback) return d.promise.nodeify(callback);
      return err;
    }
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
   * cb (optional) - optional CommonJS (Node style) callback
   */
  function firstPaymentDate(loan, cb) {
    var d = Q.defer();
    var closingDate = loan.closingDate ? moment(loan.closingDate) : new Date();
    var firstPaymentDay = loan.firstPaymentDay ? loan.firstPaymentDay : 1;

    try {
      closingDate = moment(closingDate);
      var result = closingDate.date() > 1 ? closingDate.add('M', 2).date(firstPaymentDay)
          : closingDate.add('M', 1).date(1);

      result = result.toISOString();

      d.resolve(result);
      if (cb) return d.promise.nodeify(cb);
      return  result;

    } catch (err) {
      d.reject(new Error(err));
      if (cb) return d.promise.nodeify(cb);
      return null;
    }
  }

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
  function generateAmortizationTable(loan, callback) {
    var d = Q.defer();
    if (!loan || !loan.loanAmount || !loan.term || !loan.interestRate) {
      d.reject(new Error('parameters are incorrect'));
    } else {
      var loanAmount = Number(loan.loanAmount);
      var term = Number(loan.term);
      var interestRate = Number(loan.interestRate);
      var frequency = Number(loan.frequency);
      var type = loan.type && !_.isEmpty(loan.type) ? Number(loan.type) : 0;
      var currDate = loan.firstPaymentDate && !_.isEmpty(loan.firstPaymentDate) && firstPaymentDate.constructor === Date
          ? moment(firstPaymentDate) : moment();
      var dateOffset = 1;
      var lastPaymentDate = currDate.clone().add('M', term);
      var paymentDay = currDate.date();
      var payments = 0;
      var tempDate, tempDay, balloonPeriod, balloonAmount, payment, balance;
      var interestRate = interestRate / 100;
      var semimonthly = false;
      var balloonDate = loan.balloonDate ? moment(loan.balloonDate) : null;
      var schedule = [];
      var totalInterest = 0.0;
      var currInterest = 0;
      var currPrinciple = 0;

      if (!frequency || frequency === 'monthly') {
        payments = term;
        interestRate = interestRate / 12;
        dateOffset = 1;
      } else if (frequency.toLowerCase() === 'semimonthly') {
        (payments = term * 2).toInteger();
        interestRate = interestRate / 12 / 2;
        semimonthly = true;
        dateOffset = parseInt(365.25 / 12 / 2);
      } else if (frequency.toLowerCase() === 'bimonthly') {
        payments = (term / 2).toInteger();
        interestRate = interestRate / 12 * 2;
        dateOffset = 2;
      } else if (frequency.toLowerCase() === 'quarterly') {
        payments = (term / 4).toInteger();
        interestRate = interestRate / 12 * 4;
        dateOffset = 4;
      } else if (frequency.toLowerCase() === 'semiannually') {
        payments = (term / 6).toInteger();
        interestRate = interestRate / 12 * 6;
        dateOffset = 6;
      } else if (frequency.toLowerCase() === 'annually') {
        payments = (term / 12).toInteger();
        interestRate = interestRate / 12 * 12;
        dateOffset = 12;
      } else if (frequency.toLowerCase() === 'none' || frequency.toLowerCase() === 'one') {
        payments = 1;
        interestRate = interestRate * (term / 12);
        dateOffset = payments;
      }

      if (balloonDate) {
        if (balloonDate.isAfter(lastPaymentDate) || balloonDate.isBefore(currDate)) {
          d.reject(new Error('balloon date must be after first payment date and before last payment date'))
        } else {
          tempDate = moment(firstPaymentDate);
          tempDay = tempDate.date();

          for (var a = 0; a < payments; a++) {
            if (semimonthly) {
              if (a.isOdd()) {
                tempDate.add('d', dateOffset);
                tempDate.date(tempDay);
              } else {
                tempDate.add('d', dateOffset);
              }
            } else {
              tempDate.add('M', dateOffset);
            }
            balloonPeriod = (!balloonDate.isAfter(tempDate) && !balloonDate.isBefore(tempDate)) ? a : term;
          }
        }
        balloonAmount = calculator.BalloonLoan(loanAmount, interestRate, payments, null, balloonPeriod, type).balloonAmount;
      }

      loan.payments = payments;
      loan.interestRate
      payment = this.paymentAmount(loan);
      balance = loanAmount;

      for (var i = 0; i < payments; i++) {
        currInterest = balance * interestRate;
        totalInterest += currInterest;
        currPrinciple = payment - currInterest;
        balance -= currPrinciple;
        if (i === balloonPeriod) {
          payment = payment + balloonAmount + currInterest;
          currPrinciple = payment;
          balance = 0;
        }

        schedule.push({
          paymentNumber: i + 1,
          principle: balance,
          accumulatedInterest: totalInterest,
          payment: payment,
          paymentToPrinciple: currPrinciple,
          paymentToInterest: currInterest,
          date: currDate.toISOString()
        });

        if (i === balloonPeriod) break;

        if (semimonthly) {
          if (i.isOdd()) {
            currDate.add('d', dateOffset);
            currDate.date(paymentDay);
          } else {
            currDate.add('d', dateOffset);
          }
        } else {
          currDate.add('M', dateOffset);
        }
      }

      d.resolve(schedule);
      if (callback) return d.promise.nodeify(callback);
      return schedule;
    }
  }

  /*
   isLoanPastDue
   -------
   This calculates if a loan is past due and returns a boolean, with true indicating the loan
   is past due. To do so, it takes a loan (as a Javascript object) with certain parameters and
   analyzes the loan against a series of transactions which are also included in the Javascript
   object. If the total interest and the total principal
   paid on the loan is less than what it should be, the loan is past due.

   This function takes the following arguments:
   * loan object (required) - a Javascript object with the following required properties:
   - InitialLoanAmount - the loan amount due when the loan was originated and closed
   - OriginationDate - the date when the loan was originated and closed
   - InterestPrepaymentAmount - the amount paid on the OriginationDate to prepay interest on
   the loan up to the FirstPaymentDate or before.
   - FirstPaymentDate - the date the first payment should be received
   - Rate - the annual interest rate
   - Term - the term of the loan in months
   - Payments - the number of payments to be paid during the Term
   - DeterminationDate - the date when the amount EarnedAmount is calculated
   - GraceDays (optional) - the number of days after a payment a borrower has to make a payment
   - transactions array (required), with each element being a Javascript object containing:
   #amount
   */

  function isLoanPastDue(loan, callback) {
    var deferred = Q.defer();

    var pastDue = false;
    var earnedAmount = this.earnedAmount(loan);
    var amountPaid = 0;

    loan.transactions.forEach(function (tx) {
      amountPaid += tx.amount;
    });
    pastDue = amountPaid < earnedAmount;
    deferred.resolve(pastDue);

    if (cb) return deferred.promise.nodeify(cb);
    return deferred.promise;
  }

  /*
   EarnedAmount
   ------------
   This function calculates the amount that should have been received for a loan at a specified
   date in the future.

   This function takes a Javascript object and an optional callback. The Javascript object should
   include the following:

   * InitialLoanAmount - the loan amount due when the loan was originated and closed
   * OriginationDate - the date when the loan was originated and closed
   * InterestPrepaymentAmount - the amount paid on the OriginationDate to prepay interest on
   the loan up to the FirstPaymentDate or before.
   * FirstPaymentDate - the date the first payment should be received
   * Rate - the annual interest rate
   * Term - the term of the loan in months
   * Payments - the number of payments to be paid during the Term
   * DeterminationDate - the date when the amount EarnedAmount is calculated
   */

  function earnedAmount(loan, cb) {
    var deferred = Q.defer();

    var InitialLoanAmount = loan.loanAmount || 0;
    var OriginationDate = moment(loan.dateOpened) || moment();
    var FirstPaymentDate = moment(loan.firstPaymentDate) || moment();
    var Term = loan.term || 0;
    var Frequency = loan.Frequency || 'monthly';
    var Payments = this.numberOfPayments(loan);
    var Rate = loan.Rate || 0;
    var DeterminationDate = moment(loan.DeterminationDate) || moment();
    var daysBeforeFirstPayment = FirstPaymentDate.diff(OriginationDate, 'days');
    var periodicRate = Rate / 100 / (12 * Payments / Term);
    var dailyRate = Rate / 100 / 365;
    var InterestPrepaymentAmount = loan.interestPrepaymentAmount || 0;
    var interestEarnedBeforeFirstPayment = daysBeforeFirstPayment * InitialLoanAmount * dailyRate - InterestPrepaymentAmount;
    var numberOfMonths = DeterminationDate.diff(FirstPaymentDate, 'months');
    var numberOfExtraDays = DeterminationDate.diff(FirstPaymentDate, 'days') - numberOfMonths * 30;
    var Payment = this.paymentAmount(loan);
    var cumInterestPaid = this.cumulativeInterestPaid(loan, Payments, InitialLoanAmount);

    var remainingBalance = calculator.RemainingBalance(InitialLoanAmount, periodicRate, numberOfMonths, Payment);
    var interestEarnedAfterLastPayment = numberOfExtraDays * remainingBalance * dailyRate;
    var totalAmountEarned = interestEarnedBeforeFirstPayment + cumInterestPaid + InitialLoanAmount - remainingBalance + interestEarnedAfterLastPayment;
    deferred.resolve(totalAmountEarned);
    if (cb) return deferred.promise.nodeify(cb);
    return totalAmountEarned;

  }

  /*
   cumulativeInterestPaid
   ----------------------
   Calculate the total interest paid on a loan in specified periodic payments. Arguments include:
   * rate (required) - interest rate specified as a percentage, e.g., 10.5
   * periods (required) - the total number of payment periods in the term
   * PV (required) - the initial sum borrowed
   * start (optional) - the first period to include. Periods are numbered beginning with 1
   * end (optional) - the last period to include
   * type (optional) - whether payments are made at the end of each period (0) or at the start of each period (1)
   * callback (optional) - callback for asynchronous processing using Node's CommonJS format
   */
  function cumulativeInterestPaid(loan, params, callback) {
    var deferred = Q.defer();
    if(!loan || !loan.interestRate || !loan.term || !loan.payments || !loan.loanAmount || !params.startPeriod || !params.endPeriod) {
      deferred.reject(new Error("function arguments not provided"));
    } else {

    }
    try {

      var rate = Number(loan.interestRate);
      var NPER = Number(loan.term);
      var PV = Number(loan.loanAmount);
      var start = params.startPeriod != null ? Number(params.startPeriod) : null;
      var end = params.endPeriod != null ? Number(params.endPeriod) : null;
      var type = type != null ? Number(loan.type) : null;

      var ip = function (rate, NPER, PV, type) {
        return type && type === 1
            ? (PV * (Math.pow(1 + rate, NPER) - 1)) * (1 + rate)
            : PV * (Math.pow(1 + rate, NPER) - 1);
      };

      var presentValueBeforeStart = start != null
          ? ip(rate, start, PV, type) + PV
          : null;

      var result = presentValueBeforeStart
          ? ip(rate, end != null ? end - start : NPER - start, presentValueBeforeStart, type)
          : ip(rate, NPER, PV, type);

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

    } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
    }
  }

})();

