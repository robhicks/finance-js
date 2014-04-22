(function () {
  var service = {
    presentValueOfLumpSum: presentValueOfLumpSum,
    numberOfPayments: numberOfPayments,
    paymentAmount: paymentAmount,
    firstPaymentDate: firstPaymentDate,
    addAmorizationTable: addAmorizationTable,
    isLoanPastDue: isLoanPastDue,
    earnedAmount: earnedAmount,
    cumulativeInterestPaid: cumulativeInterestPaid,
    nextPaymentDate: nextPaymentDate,
    dateLastPaymentShouldHaveBeenMade: dateLastPaymentShouldHaveBeenMade,
    dateLastPaymentWasReceived: dateLastPaymentWasReceived,
    outstandingPrincipal: outstandingPrincipal,
    aggregateLateFees: aggregateLateFees,
    interestAllocationForPayment: interestAllocationForPayment,
    paymentAllocations: paymentAllocations
  };
  var _, moment;

  if (typeof module !== 'undefined' && module.exports) {
    Q = require('q');
    _ = require('lodash');
    moment = require('moment');
    module.exports = service;
  } else if (typeof angular !== 'undefined') {
    _ = window._;
    moment = window.moment;
    angular.module('FinanceJs', [])
        .factory('FinanceJSService', ['$q', function ($q) {
          Q = $q;
          return service;
        }]);
  } else {
    window.finance = this;
  }

  /*
   presentValueOfLumpSum
   -----------
   Calculates the present value of a lump sum received in the future. Params include:
   * rate (required) - the interest rate per period
   * NPER (required) - total number of periods
   * FV (required) - the future value or lump sum to be received
   */
  function presentValueOfLumpSum(params) {
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
  function numberOfPayments(loan, cb) {
    var d = Q.defer();
    if (!loan || !loan.term || !loan.frequency) {
      d.reject(new Error('improper parameters'));
    } else {
      var frequency = loan.frequency.toLowerCase();
      var term = loan.term ? Number(loan.term) : 0;

      if (frequency === 'semimonthly') {
        (loan.payments = parseInt(term * 2));
      } else if (frequency === 'bimonthly') {
        loan.payments = (parseInt(term / 2));
      } else if (frequency === 'quarterly') {
        loan.payments = (parseInt(term / 4));
      } else if (frequency === 'semiannually') {
        loan.payments = (parseInt(term / 6));
      } else if (frequency === 'annually') {
        loan.payments = (parseInt(term / 12));
      } else if (frequency === 'none' || frequency === 'one') {
        loan.payments = 1;
      } else {
        loan.payments = term;
      }

      d.resolve(loan);
      if (cb) return cb(loan);
      return d.promise;
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
  function paymentAmount(loan, cb) {
    var d = Q.defer();

    if (!loan || !loan.loanAmount || !loan.term || !loan.interestRate) {
      d.reject(new Error('required parameters not provided'));
    } else {
      var interestRate = loan.interestRate ? Number(loan.interestRate) / 1200 : 0;
      var term = loan.term ? Number(loan.term) : 0;
      var loanAmount = loan.loanAmount ? Number(loan.loanAmount) : 0;
      var type = loan.type != null ? Number(loan.type) : 0;
      var interestOnly = loan.interestOnly ? Boolean(loan.interestOnly) : false;

      if (interestRate === 0) {
        if (term > 0) {
          loan.paymentAmount = loanAmount / term;
        } else {
          loan.paymentAmount = 0;
        }
      } else {
        if (interestOnly) {
          loan.paymentAmount = (loanAmount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1)) - loanAmount;
        } else {
          loan.paymentAmount = loanAmount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1);
        }
      }
      d.resolve(loan);
      if (cb) return cb(loan);
      return d.promise;
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
    if (!loan.closingDate) {
      d.reject(new Error('closing date required to determine firstPaymentDate'));
    } else {
      var closingDate = loan.closingDate ? moment(loan.closingDate) : moment();
      var firstPaymentDay = !_.isEmpty(loan.firstPaymentDay) ? loan.firstPaymentDay : 1;

      loan.firstPaymentDate = closingDate.date() > 1 ? closingDate.add('M', 2).date(firstPaymentDay)
          : closingDate.add('M', 1).date(1);
      loan.firstPaymentDate = loan.firstPaymentDate.toISOString();
      d.resolve(loan);
    }
    if (cb) return cb(loan);
    return d.promise;
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
  function addAmorizationTable(loan, cb) {
    var d = Q.defer();
    if (!loan || !loan.loanAmount || !loan.term || !loan.interestRate || !loan.firstPaymentDate || !loan.paymentAmount) {
      d.reject(new Error('parameters are incorrect'));
    } else {
      var loanAmount = Number(loan.loanAmount);
      var term = Number(loan.term);
      var interestRate = Number(loan.interestRate) / 100;
      var frequency = String(loan.frequency).toLowerCase();
      var type = loan.type && !_.isEmpty(loan.type) ? Number(loan.type) : 0;
      var currDate = moment(loan.firstPaymentDate);
      var dateOffset = 1;
      var lastPaymentDate = currDate.clone().add('M', term);
      var paymentDay = currDate.date();
      var payments = 0;
      var semimonthly = false;
      var balloonDate = loan.balloonDate ? moment(loan.balloonDate) : null;
      var schedule = [];
      var totalInterest = 0.0;
      var currInterest = 0;
      var currPrinciple = 0;
      var tempDate, tempDay, balloonPeriod, balloonAmount, payment, startingPrincipal, balance;

      switch (frequency) {
        case 'semimonthly':
          payments = term * 2;
          interestRate = interestRate / 12 / 2;
          semimonthly = true;
          dateOffset = parseInt(365.25 / 12 / 2);
          break;
        case 'bimonthly':
          payments = term / 2;
          interestRate = interestRate / 12 * 2;
          dateOffset = 2;
          break;
        case 'quarterly':
          payments = term / 4;
          interestRate = interestRate / 12 * 4;
          dateOffset = 4;
          break;
        case 'semiannually':
          payments = term / 6;
          interestRate = interestRate / 12 * 6;
          dateOffset = 6;
          break;
        case 'annually':
          payments = term / 12;
          interestRate = interestRate / 12 * 12;
          dateOffset = 12;
          break;
        default:
          payments = term;
          interestRate = interestRate / 12;
          dateOffset = 1;
          break;
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
          txDate: currDate.toISOString()
        });

        startingPrincipal -= currPrinciple;

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
      loan.amortizationTable = schedule;
      if (cb) return cb(loan);
      d.resolve(loan);
    }
    return d.promise;
  }

  /**
   * isLoanPastDue
   * @param loan
   * - amortizationTable - an array of transactions
   * - transactions - a list of payment transactions
   * - dateLastPaymentShouldHaveBeenMade - obvious
   * - dateLastPaymentWasReceived - obvious
   * @returns {promise|Q.promise}
   * compares amount of payments that have been received against those that
   * should have been received.
   */
  function isLoanPastDue(loan, cb) {
    var d = Q.defer();
    var paid = 0;
    var earned = 0;
    var date, pmtTxs, amortTxs;
    if (!loan || !loan.amortizationTable || !loan.transactions || !loan.dateLastPaymentShouldHaveBeenMade) {
      d.reject('required isLoanPastDue parameters not provided')
    } else {
      date = moment();
      var pmtTxs = loan.transactions.filter(function(tx){
        return tx.type !== "Late Fee" && moment(tx.txDate).isBefore(date);
      });
      var amortTxs = loan.amortizationTable.filter(function(pmt){
        return moment(pmt.txDate).isBefore(date);
      });
      pmtTxs.forEach(function(tx){
        if(!isNaN(tx.amount)) paid += tx.amount;
      });
      amortTxs.forEach(function(tx){
        if(!isNaN(tx.amount)) earned += tx.amount;
      });
      if(paid < earned) {
        loan.pastDueAmount = earned - paid;
        loan.pastDue = true;
      } else {
        loan.pastDue = false;
        loan.pastDueAmount = 0;
      }
      d.resolve(loan);
      if (cb) return cb(loan);
    }
    return d.promise;
  }

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

  function earnedAmount(loan, cb) {
    var deferred = Q.defer();
    if (!loan || !loan.loanAmount || !loan.closingDate
        || !loan.firstPaymentDate || !loan.interestRate || !loan.term
        || !loan.payments || !loan.determinationDate || !loan.paymentAmount) {
      deferred.reject(new Error('earnedAmount cannot be calculated without required parameters'));
    } else {

    }

    var InitialLoanAmount = Number(loan.loanAmount);
    var OriginationDate = moment(loan.closingDate);
    var FirstPaymentDate = moment(loan.firstPaymentDate);
    var Term = loan.term;
    var Frequency = loan.frequency ? loan.frequency : 'monthly';
    var Payments = Number(loan.payments);
    var Rate = Number(loan.interestRate);
    var DeterminationDate = moment(loan.determinationDate);
    var daysBeforeFirstPayment = FirstPaymentDate.diff(OriginationDate, 'days');
    var periodicRate = Rate / 100 / (12 * Payments / Term);
    var dailyRate = Rate / 100 / 365;
    var InterestPrepaymentAmount = loan.prepaidInterest ? Number(loan.prepaidInterest) : 0;
    var interestEarnedBeforeFirstPayment = daysBeforeFirstPayment * InitialLoanAmount * dailyRate - InterestPrepaymentAmount;
    var numberOfMonths = DeterminationDate.diff(FirstPaymentDate, 'months');
    var numberOfExtraDays = DeterminationDate.diff(FirstPaymentDate, 'days') - numberOfMonths * 30;
    var Payment = Number(loan.paymentAmount);
    cumulativeInterestPaid(loan)
    var cumInterestPaid = this.cumulativeInterestPaid(loan, Payments, InitialLoanAmount);

    var remainingBalance = calculator.RemainingBalance(InitialLoanAmount, periodicRate, numberOfMonths, Payment);
    var interestEarnedAfterLastPayment = numberOfExtraDays * remainingBalance * dailyRate;
    var totalAmountEarned = interestEarnedBeforeFirstPayment + cumInterestPaid + InitialLoanAmount - remainingBalance + interestEarnedAfterLastPayment;

    deferred.resolve(totalAmountEarned);
    if (cb) return cb(loan);
    return deferred.promise;

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
    if (!loan || !loan.interestRate || !loan.term || !loan.payments || !loan.loanAmount || !params.startPeriod || !params.endPeriod) {
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

  /**
   * nextPaymentDate
   * @param loan
   * - dateLastPaymentWasReceived
   * - amortizationTable
   * @returns {promise|Q.promise}
   */
  function nextPaymentDate(loan, cb) {
    var d = Q.defer();
    var item;
    var result;
    if (!loan || !loan.dateLastPaymentWasReceived || !loan.amortizationTable) {
      d.reject('required parameters for nextPaymentDue not provided');
    } else {
      var dateLastPaymentWasReceived = moment(loan.dateLastPaymentWasReceived);
      for (var i = 0, len = loan.amortizationTable.length; i < len; i++) {
        item = loan.amortizationTable[i];
        txDate = moment(item.txDate);
        if (txDate.isAfter(dateLastPaymentWasReceived)) {
          result = item.txDate;
          break;
        }
        result = item.txDate;
      }
    }
    loan.nextPaymentDate = result;
    d.resolve(loan);
    if (cb) return cb(loan);
    return d.promise;
  }

  /**
   * Calculates the last date a payment should have been
   * @param loan, which must include
   *  - amortizationTable - a loan amortization table with the expected payment dates
   *  - daysUntilLate (optional) - the grace days for the loan - defaults to 0
   *  - determinationDate (optional) - the date the determination is made, defaults to today
   */
  function dateLastPaymentShouldHaveBeenMade(loan, cb) {
    var d = Q.defer();
    var result;
    if (!loan || !loan.amortizationTable) {
      d.reject(new Error('required dateLastPaymentShouldHaveBeenMade not provided'));
    } else {
      var determinationDate = loan.determinationDate ? moment(loan.determinationDate) : moment();
      var daysUntilLate = loan.daysUntilLate ? Number(loan.daysUntilLate) : 0;
      determinationDate.add('days', daysUntilLate);
      loan.amortizationTable.forEach(function (payment) {
        var paymentDate = moment(payment.date);
        if (paymentDate.isBefore(determinationDate)) result = paymentDate.toISOString();
      });
      loan.dateLastPaymentShouldHaveBeenMade = result;
      d.resolve(loan)
    }
    if (cb) return cb(loan);
    return d.promise;
  }

  /**
   * dateLastPaymentWasReceived
   * @param loan
   * - transactions
   */
  function dateLastPaymentWasReceived(loan, cb) {
    var d = Q.defer();
    var result;
    if (!loan) {
      d.reject('required parameters for dateLastPaymentWasReceived not provided');
    }
    var last = _.max(loan.transactions, function (tx) {
      return tx.txDate
    });
    loan.dateLastPaymentWasReceived = last.txDate || loan.closingDate;
    d.resolve(loan);
    if (cb) return cb(loan);
    return d.promise;
  }

  /**
   *
   * @param loan
   * - transactions
   * - loanAmount
   * @returns {promise|Q.promise}
   */
  function outstandingPrincipal(loan, cb) {
    var d = Q.defer();
    var sumOfPayments = 0;
    if (!loan || !loan.loanAmount || !loan.transactions) {
      d.reject(new Error('required parameters for outstandingPrincipal not provided'))
    } else {
      loan.transactions.forEach(function (tx) {
        sumOfPayments += typeof tx.principal === "number" ? tx.principal : 0;
      });
      loan.loanBalance = loan.loanAmount - sumOfPayments;
      d.resolve(loan);
    }
    if (cb) return cb(loan);
    return d.promise;
  }

  /**
   *
   * @param loan
   * @param cb
   * @returns {*}
   */
  function aggregateLateFees(loan, cb) {
    var d = Q.defer();
    var determinationDate = moment();
    var lateFeeTxs;
    var temp = 0;

    if (!loan || !loan.transactions) {
      d.reject(new Error('required parameters for aggregateLateFees not provided'));
    } else {
      lateFeeTxs = loan.transactions.filter(function(tx){
        return moment(tx.txDate).isBefore(determinationDate) && tx.type === "Late Fee";
      });
      lateFeeTxs.forEach(function(tx){
        if(!isNaN(tx.amount)) temp += tx.amount;
      });
      loan.aggregateLateFees = temp;
      d.resolve(loan);
      if (cb) return cb(loan);
    }
    return d.promise;
  }


  /**
   *
   * @param loan
   * - closingDate
   * - loanAmount
   * - interestRate
   * - transactions
   * - paymentAmount
   * - determinationDate
   * - daysInYear
   * @returns {exports.pending.promise|*|promise|Q.defer.promise|Deferred.promise|Pending.promise}
   */
  function interestAllocationForPayment(loan, cb) {
    var d = Q.defer();
    var days = 0;
    var daysInYear = loan.daysInYear || 365;
    var determinationDate = loan.determinationDate ? moment(loan.determinationDate) : moment();
    var closingDate;
    var rate;
    var interestPaid = 0;
    if (!loan || !loan.closingDate || !loan.loanAmount || !loan.interestRate || !loan.paymentAmount) {
      d.reject(new Error('required parameters for accruedInterestForLoanTx not provided'));
    } else {
      closingDate = moment(loan.closingDate);
      days = determinationDate.diff(closingDate, 'days');
      rate = loan.interestRate / 100 / daysInYear;
      var accruedInterest = loan.loanAmount * days * rate;
      loan.transactions.forEach(function (tx) {
        var paymentDate = moment(tx.date);
        if (paymentDate.isBefore(determinationDate)) interestPaid += tx.interest;
      });
      loan.allocationToInterest = (accruedInterest - interestPaid) < loan.paymentAmount
          ? accruedInterest - interestPaid
          : loan.paymentAmount;
      d.resolve(loan);
    }
    if (cb) return cb(loan);
    return d.promise;
  }

  function paymentAllocations(loan, cb) {
    var d = Q.defer();
    var daysInYear = loan.daysInYear || 365;
    var interestPaid = 0;
    if (!loan || !loan.closingDate || !loan.loanAmount || !loan.interestRate || !loan.paymentAmount) {
      d.reject(new Error('required parameters for paymentAllocations not provided'));
    } else {
      var rate = loan.interestRate / 100 / daysInYear;
      var closingDate = moment(loan.closingDate);
      var lateFee = calcLateFee(loan);
      var determinationDate = moment();
      var firstPaymentDate = moment(loan.firstPaymentDate);
      var txDate, pmtDate, graceDate, days, accruedInterest, pmtTransactions, elapsedMonths, i;

      //Calculate parameters of payment transactions
      loan.transactions.forEach(function (tx, i) {
        if (tx.type !== "Late Fee") {
          txDate = moment(tx.txDate);
          days = txDate.diff(closingDate, 'days');
          accruedInterest = loan.loanAmount * days * rate;
          interestPaid = calcInterestPaid(loan, tx.txDate);
          tx.interest = (accruedInterest - interestPaid) < tx.amount
              ? accruedInterest - interestPaid
              : tx.amount;
          tx.principal = tx.amount - tx.interest;
//          console.log(i, tx.paymentNumber);
          tx.paymentDueDate = i > 0 && loan.amortizationTable[tx.paymentNumber] ? loan.amortizationTable[tx.paymentNumber - 1].txDate : loan.firstPaymentDate;
          tx.loanBalance = getLoanBalance(loan, txDate) - tx.principal;
        }
      });

      //Add late fee transactions
      pmtTransactions = loan.transactions.filter(function (tx) {
        return tx.type !== 'Late Fee';
      });
      //calculate the number of months that have lapsed starting with the first payment date
      //until the determination date
      elapsedMonths = determinationDate.diff(firstPaymentDate, 'months') + 1;
      for(i = 0; i < elapsedMonths; i++){
        pmtDate = moment(firstPaymentDate.add('months', i));
        graceDate = pmtDate.add('days', loan.daysUntilLate);
        if (!paymentMadeOnTime(pmtTransactions, pmtDate, graceDate, loan.paymentAmount)
            && pmtDate.isBefore(determinationDate) && !lateFeeAppliedForDate(loan, graceDate)) {
          txDate = graceDate.toISOString();
          loan.transactions.push({
            txDate: txDate,
            type: "Late Fee",
            amount: -1 * lateFee,
            comments: "Late fee imposed for failure to pay on time or to pay proper amount",
            loanBalance: getLoanBalance(loan, txDate)
          });
        }
      }
      /*
      loan.amortizationTable.forEach(function (pmt) {
        pmtDate = moment(pmt.txDate).subtract('days', 1);
        graceDate = moment(pmt.txDate).add('days', loan.daysUntilLate);
        if (!paymentMadeOnTime(pmtTransactions, pmtDate, graceDate, loan.paymentAmount)
            && pmtDate.isBefore(determinationDate) && !lateFeeAppliedForDate(loan, graceDate)) {
          txDate = graceDate.toISOString();
          loan.transactions.push({
            txDate: txDate,
            type: "Late Fee",
            amount: -1 * lateFee,
            comments: "Late fee imposed for failure to pay on time or to pay proper amount",
            loanBalance: getLoanBalance(loan, txDate)
          });
        }
      });
      */
//      loan.update({$pull: {transactions: {type: "Late Fee"}}}, function(err, count){
//        console.log(count);
//      });
//      console.log(loan.transactions);
      d.resolve(loan);
    }
    if (cb) return cb(loan);
    return d.promise;
  }

  function paymentMadeOnTime(pmtTransactions, paymentDate, graceDate, amount){
    var result = false;
    var tx, txDate;
    for (var i = 0, len = pmtTransactions.length; i < len; i++) {
      tx = pmtTransactions[i];
      txDate = moment(tx.txDate);
      if (txDate.isBefore(graceDate) && txDate.isAfter(paymentDate) && tx.amount >= amount) {
        result = true;
        break;
      }
    }
    return result;
  }

  function lateFeeAppliedForDate(loan, txDate){
    txDate = txDate._isAMomentObject ? txDate : moment(txDate);
    var result = false;
    var lateFeeTxs = loan.transactions.filter(function(tx){return tx.type === "Late Fee"});
    lateFeeTxs.forEach(function(tx){
      if(moment(tx.txDate).isSame(txDate)) result = true;
    });
    return result;
  }

  function getLoanBalance(loan, determinationDate) {
    var originalLoanAmount = Number(loan.loanAmount) || 0;
    var principalPayments = 0;
    var dDate = determinationDate instanceof moment ? dDate : moment(determinationDate);
    var txDate;
    loan.transactions.forEach(function (tx) {
      txDate = moment(tx.txDate);
      if (txDate.isBefore(dDate) && tx.principal && tx.principal != undefined) principalPayments += Number(tx.principal);
    });
    return originalLoanAmount - principalPayments;
  }

  function calcLateFee(loan) {
    var lateFee = 0;
    if (loan.lateChargeType === 'lateChargeFixed') {
      if (loan.lateChargeFixed) {
        lateFee = loan.lateChargeFixed;
      }
    } else if (loan.lateChargeType === 'lateChargePercent') {
      if (loan.lateChargePercent) {
        lateFee = loan.paymentAmount * loan.lateChargePercent / 100;
        if (loan.lateChargeMin$ && lateFee < loan.lateChargeMin$) {
          lateFee = loan.lateChargeMin$;
        }
        if (loan.lateChargeMax$ && lateFee > loan.lateChargeMax$) {
          lateFee = loan.lateChargeMax$;
        }
      }
    }
    return lateFee;
  }

  function calcInterestPaid(loan, receivedDate) {
    var interestPaid = 0;
    var determinationDate = moment(receivedDate);
    var pmtDate;
    loan.transactions.forEach(function (tx) {
      pmtDate = moment(tx.txDate);
      if (pmtDate.isBefore(determinationDate) && tx.interest && tx.interest != undefined) interestPaid += Number(tx.interest);
    });
    return interestPaid;
  }

})
();

