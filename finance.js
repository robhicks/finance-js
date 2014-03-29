"use strict";

(function(window){
  if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    var when = require('when');
    var _ = require('lodash');
    var util = require('util');
    var moment = require('moment');
    module.exports = new FinanceJs();
  } else if (typeof angular !== 'undefined' && typeof angular.module !== 'undefined'){
    angular.module('FinanceJs', []);

  } else {
    window.FinanceJs = FinanceJs;
  }

  function FinanceJs(){

    this.presentValueOfLumpsump = presentValueOfLumpsump;

  }

  /*
   presentValueOfLumpsump
   -----------
   Calculates the present value of a lump sum received in the future. Params include:
   * rate (required) - the interest rate per period
   * NPER (required) - total number of periods
   * FV (required) - the future value or lump sum to be received
   */
  function presentValueOfLumpsump(params, cb){
    var d = when.defer();
    if(!params || _.isEmpty(params.rate) ||  _.isEmpty(params.NPER ||  _.isEmpty(params.FV)){
      d.reject(new Error('params object not provided or params does not include rate, NPER and FV'))
    } else {
      var result = FV / Math.pow(1 + rate, NPER);
      d.resolve(result);
    }
    if(cb) return result;
    return d.promise;
  }

})();





/*
 PVofLumpSum
 -----------
 Calculates the present value of a lump sum received in the future. Arguments include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of periods
 * FV (optional) - the future value or lump sum to be received
 */
calculator.PVofLumpSum = function (rate, NPER, FV, callback) {
   var deferred = Q.defer();

   try {
      //assure we can pass promise to callback
      if (typeof rate === 'function') callback = rate;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof FV === 'function') callback = FV;

      rate = Number(rate);
      NPER = Number(NPER);
      FV = Number(FV);

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
      if (!calculator.isPositiveNumber(FV)) throw new Error('FV' + calculator.validationErrors[0]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

      var result = FV / Math.pow(1 + rate, NPER);
      result = result.round(2);
      deferred.resolve(result);

      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

/*
 PV
 --
 Calculates the present value of an investment resulting from a series of regular payments. Arguments include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of payment periods
 * PMT (required)  the regular payment made each period
 * type (optional) - wether payments made 0 - at the end of each period or 1 - at the start of each period (including a payment at the start of the term)
 */
calculator.PV = function (rate, NPER, PMT, type, callback) {
   var deferred = Q.defer();
   try {

      //assure we can pass promise to callback
      if (typeof rate === 'function') callback = rate;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof PMT === 'function') callback = PMT;
      if (typeof type === 'function') callback = type;

      rate = Number(rate);
      NPER = Number(NPER);
      PMT = Number(PMT);
      type = type != null ? Number(type) : null;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
      if (!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
      if (type && !calculator.isProperType(type)) throw new Error('type' + calculator.validationErrors[2]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
      type = type || 0;

      var annuityImmediate = PMT * ( (1 - Math.pow(1 + rate, -NPER)) / rate );
      var annuityDue = annuityImmediate * (1 + rate);

      var result = type === 0 ? annuityImmediate : annuityDue;
      result = result.round(2);

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);

      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};


/*
 PVofPerpetuity
 --------------
 Calculates the present value of an investment with an unlimited number of regular payments. Arguments include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of payment periods
 * PMT (required)  the regular payment made each period
 */
calculator.PVofPerpetuity = function (rate, PMT, callback) {
   var deferred = Q.defer();

   try {
      //assure we can pass promise to callback
      if (typeof rate === 'function') callback = rate;
      if (typeof PMT === 'function') callback = PMT;

      rate = Number(rate);
      PMT = Number(PMT);

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

      var result = PMT / rate;
      result = result.round(2);

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

/*
 CumulativeInterestPaid
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
calculator.CumulativeInterestPaid = function (rate, NPER, PV, start, end, type, callback) {
   var deferred = Q.defer();
   try {
      //assure we can pass promise to callback
      if (typeof rate === 'function') callback = rate;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof PV === 'function') callback = PV;
      if (typeof start === 'function') callback = start;
      if (typeof end === 'function') callback = end;
      if (typeof type === 'function') callback = type;

      rate = Number(rate);
      NPER = Number(NPER);
      PV = Number(PV);
      start = start != null ? Number(start) : null;
      end = end != null ? Number(end) : null;
      type = type != null ? Number(type) : null;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
      if (!calculator.isRequiredPositiveNumber(PV)) throw new Error('PV' + calculator.validationErrors[0]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
      if (start && (!calculator.isPositiveInteger(start) || start < 1 || start > NPER)) throw new Error('start' + calculator.validationErrors[1]);
      if (end && (!calculator.isPositiveInteger(end) || end < start || end > NPER)) throw new Error('end' + calculator.validationErrors[1]);
      if (type && !calculator.isProperType(type)) throw new Error('type' + calculator.validationErrors[2]);

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

      result = result.round(2);

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

/*
 FV
 --
 Calculates future value of an investment based on equal periodic payments. Arugments include:
 * rate (required) - the periodic interest rate
 * NPER (required) - the number of periods
 * PMT (required) - the equal periodic payments
 * type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period
 * callback (optional) - callback for asynchronous processing using Node's CommonJS format
 */
calculator.FV = function (rate, NPER, PMT, type, callback) {
   var deferred = Q.defer();
   try {
      //assure we can pass promise to callback
      if (typeof rate === 'function') callback = rate;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof PMT === 'function') callback = PMT;
      if (typeof PV === 'function') callback = PV;
      if (typeof type === 'function') callback = type;

      rate = Number(rate);
      NPER = Number(NPER);
      PMT = Number(PMT);
      type = type != null ? Number(type) : 0;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
      if (!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
      if (!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

      var result = calculator.PV(rate, NPER, PMT, type) * Math.pow(1 + rate, NPER);
      result = result.round(2);

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

/*
 NPER
 ----

 Caculates the number of periods for an investment based on periodic, constant payments
 and a constant interest rate. Arguments include:
 * rate (required) - the periodic interest rate
 * PMT (required) - the constant payment paid in each period
 * FV (required) - the future value of the last period
 * type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period
 * callback (optional) - callback for asynchronous processing using Node's CommonJS format
 */
//determine the months financed
calculator.NPER = function (rate, PMT, FV, type, callback) {
   var deferred = Q.defer();
   try {
      //assure we can pass promise to callback
      if (typeof rate === 'function') callback = rate;
      if (typeof PMT === 'function') callback = PMT;
      if (typeof FV === 'function') callback = FV;
      if (typeof type === 'function') callback = type;

      rate = Number(rate);
      PMT = Number(PMT);
      FV = Number(FV);
      type = type != null ? Number(type) : 0;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveNumber(FV)) throw new Error('FV' + calculator.validationErrors[0]);
      if (type != null && !calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

      var result = type == 0
         ? Math.round(-Math.log(1 - rate * FV / PMT) / Math.log(1 + rate))
         : Math.round(-Math.log(1 - rate * FV / PMT) / Math.log(1 + rate)) - 1;

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {

      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};
/*
 PMT
 ---
 calculates the payment for a loan with the following parameters:
 * PV (required) - loan amount
 * NPER (required) - the number of periods
 * rate (required) - the rate per period
 * interestOnly (optional) - boolean indicating if the loan is an interest only loan
 * type (optional) - whether the payment is made at the beginning (1) or the end (0) of a period
 */
calculator.PMT = function (PV, NPER, rate, interestOnly, type, callback) {
   var deferred = Q.defer();
   try {
      //assure we can pass promise to callback
      if (typeof PV === 'function') callback = PV;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof rate === 'function') callback = rate;
      if (typeof interestOnly === 'function') callback = interestOnly;
      if (typeof type === 'function') callback = type;

      rate = rate ? Number(rate) : 0;
      NPER = NPER ? Number(NPER): 0;
      PV = PV ? Number(PV) : 0;
      type = type != null ? Number(type) : 0;
      interestOnly != null ? Boolean(interestOnly) : false;

      NPER = type === 0 ? NPER : NPER + 1;

      // If the interest rate is 0, return PV / NPER
      // If the interest rate is greater than 0 and the loan is an interest only loan, return

      var result;

      if (rate === 0){
         if (NPER > 0 ){
            result = PV / NPER;
         } else {
            result = 0;
         }
      } else {
         if (interestOnly){
            result = (PV * (rate * Math.pow(1 + rate, NPER)) / (Math.pow(1 + rate, NPER) - 1)) - PV;
         } else {
            result = PV * (rate * Math.pow(1 + rate, NPER)) / (Math.pow(1 + rate, NPER) - 1);
         }
      }

      result.round(2);

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;
   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};
/*
 BalloonLoan
 --------------

 This function calculates the payment or amount for a loan that includes a balloon feature. A loan
 with a balloon feature either has a amount of principal that must be paid off after all
 periodic payments have been made OR requires the borrower to pay off the loan at a date
 before all periodic payments have been made. This function includes the following arguments:

 * PV (required) - the amount of the loan
 * rate (required) - the periodic interest rate
 * NPER (required) - the number of periods of the loan
 * balloonAmount (required) - the principal amount of the balloon.
 This is required if the balloonPeriod is not provided. If the balloonPeriod is provided
 and is less than NPER, the balloonAmount will be computed.
 * balloonPeriod (optional) - the period in which the balloon payment is required.
 * type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period

 This function returns an object that contains the balloonAmount and the balloonPayment for the loan.
 */
calculator.BalloonLoan = function (PV, rate, NPER, balloonAmount, balloonPeriod, type, callback) {
   var deferred = Q.defer();

   try {

      //assure we can pass promise to callback
      if (typeof PV === 'function') callback = PV;
      if (typeof rate === 'function') callback = rate;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof balloonAmount === 'function') callback = balloonAmount;
      if (typeof balloonPeriod === 'function') callback = balloonPeriod;
      if (typeof type === 'function') callback = type;

      rate = Number(rate);
      NPER = Number(NPER);
      PV = Number(PV);
      balloonAmount = Number(balloonAmount);
      balloonPeriod = balloonPeriod != null ? Number(balloonPeriod) : null;
      type = type != null ? Number(type) : 0;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(PV)) deferred.reject(new Error('BalloonLoan: PV' + calculator.validationErrors[0]));
      if (!calculator.isRequiredPositiveNumber(rate)) deferred.reject(new Error('BalloonLoan: rate' + calculator.validationErrors[0]));
      if (!calculator.isRequiredPositiveInteger(NPER)) deferred.reject(new Error('BalloonLoan: NPER' + calculator.validationErrors[1]));
      if (!calculator.isPositiveNumber(balloonAmount)) deferred.reject(new Error('BalloonLoan: balloonAmount' + calculator.validationErrors[0]));
      if (balloonPeriod && !calculator.isPositiveInteger(balloonPeriod)) deferred.reject(new Error('BalloonLoan: balloonPeriod' + calculator.validationErrors[0]));
      if (callback && !calculator.isFunction(callback)) deferred.reject(new Error('BalloonLoan: callback', calculator.validationErrors[3]));
      NPER = type === 0 ? NPER : NPER + 1;

      var result = {};

      if (!balloonAmount && !balloonPeriod) deferred.reject(new Error('BalloonLoan: balloonAmount or balloonPeriod must be provided'));
      var calcAmount = (balloonPeriod && balloonPeriod < NPER);

      if (calcAmount) {
         var payment = calculator.PMT(PV, NPER, rate, type);
         result.balloonPayment = payment;
         result.balloonAmount = calculator.RemainingBalance(PV, rate, balloonPeriod, payment, type);
      } else {
         result.balloonAmount = balloonAmount.round(2);
         result.balloonPayment = ((PV - (balloonAmount / Math.pow(1 + rate, NPER))) * (rate / (1 - Math.pow(1 + rate, -NPER)))).round(2);
      }

      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

/*
 GenAmortizationSchedule
 -----------------------
 This function generates an amortization schedule. The schedule is returned as a Javascript object.

 The function accepts the following arguments:
 * amount (required): the starting principal amount of the loan
 * months (required): the number of whole months over which the loan extends
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
calculator.GenAmortizationSchedule = function (PV, NPER, rate, firstPaymentDate, frequency, balloonDate, type, callback) {

   var deferred = Q.defer();
   try {
      //assure we can pass promise to callback
      if (typeof PV === 'function') callback = PV;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof rate === 'function') callback = rate;
      if (typeof firstPaymentDate === 'function') callback = firstPaymentDate;
      if (typeof frequency === 'function') callback = frequency;
      if (typeof balloonDate === 'function') callback = balloonDate;
      if (typeof type === 'function') callback = type;

      PV = Number(PV);
      NPER = Number(NPER);
      rate = Number(rate);
      frequency = Number(frequency);
      type = type != null ? Number(type) : 0;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(PV)) deferred.reject(new Error('GenAmortizationSchedule: PV' + calculator.validationErrors[0]));
      if (!calculator.isRequiredPositiveInteger(NPER)) deferred.reject(new Error('GenAmortizationSchedule: NPER' + calculator.validationErrors[1]));
      if (!calculator.isRequiredPositiveNumber(rate)) deferred.reject(new Error('GenAmortizationSchedule: rate' + calculator.validationErrors[0]));
      if (firstPaymentDate.constructor !== Date) deferred.reject(new Error('GenAmortizationSchedule: firstPaymentDate must be Javascript Date'));
      if (frequency && typeof frequency !== 'string') deferred.reject(new Error('GenAmortizationSchedule: frequency must be a string'));
      if (balloonDate && balloonDate.constructor !== Date) deferred.reject(new Error('GenAmortizationSchedule: balloonDate must be Javascript Date'));
      if (callback && !calculator.isFunction(callback)) deferred.reject(new Error('GenAmortizationSchedule: callback', calculator.validationErrors[3]));

      var currDate = firstPaymentDate !== undefined && firstPaymentDate.constructor === Date ? moment(firstPaymentDate) : moment();
      var dateOffset = 1;
      var lastPaymentDate = currDate.clone().add('M', NPER);
      var paymentDay = currDate.date();
      var payments = 0;
      var tempDate, tempDay, balloonPeriod;
      rate = rate / 100;
      var semimonthly = false;

      if (!frequency || frequency === 'monthly') {
         payments = NPER;
         rate = rate / 12;
         dateOffset = 1;
      } else if (frequency.toLowerCase() === 'semimonthly') {
         (payments = NPER * 2).toInteger();
         rate = rate / 12 / 2;
         semimonthly = true;
         dateOffset = parseInt(365.25 / 12 / 2);
      } else if (frequency.toLowerCase() === 'bimonthly') {
         payments = (NPER / 2).toInteger();
         rate = rate / 12 * 2;
         dateOffset = 2;
      } else if (frequency.toLowerCase() === 'quarterly') {
         payments = (NPER / 4).toInteger();
         rate = rate / 12 * 4;
         dateOffset = 4;
      } else if (frequency.toLowerCase() === 'semiannually') {
         payments = (NPER / 6).toInteger();
         rate = rate / 12 * 6;
         dateOffset = 6;
      } else if (frequency.toLowerCase() === 'annually') {
         payments = (NPER / 12).toInteger();
         rate = rate / 12 * 12;
         dateOffset = 12;
      } else if (frequency.toLowerCase() === 'none' || frequency.toLowerCase() === 'one') {
         payments = 1;
         rate = rate * (NPER / 12);
         dateOffset = payments;
      }

      balloonDate = balloonDate ? moment(balloonDate) : null;
      if (balloonDate) {
         if (balloonDate.isAfter(lastPaymentDate) || balloonDate.isBefore(currDate)) {
            throw new Error('balloon date must be after first payment date and before last payment date');
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

               balloonPeriod = (!balloonDate.isAfter(tempDate) && !balloonDate.isBefore(tempDate)) ? a : NPER;
            }
         }
      }

      var balloonAmount = calculator.BalloonLoan(PV, rate, payments, null, balloonPeriod, type).balloonAmount;

      var schedule = [];
      var payment = calculator.PMT(PV, payments, rate);
      var balance = PV;
      var totalInterest = 0.0;
      var currInterest = 0;
      var currPrinciple = 0;

      for (var i = 0; i < payments; i++) {
         currInterest = balance * rate;
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

      deferred.resolve(schedule);
      if (callback) return deferred.promise.nodeify(callback);
      return schedule;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

/*
 RemainingBalance
 ----------------
 This function calculates the remaining balance of a loan. It can be used to
 calculate a balloon payment because the amount due at the end of a balloon
 loan is effectively the same as calculating the balance of a conventional
 loan after the same period. Arguments include:

 * PV (required) - the principal PV of the loan
 * rate (required) - the interest rate per NPER
 * NPER (required) - NPER (periods) of the loan (amortization period)
 * PMT (required) - payment per period
 * type (required) - whether the payment is due at the beginning (1) or the end (0) of a period
 */
calculator.RemainingBalance = function (PV, rate, NPER, PMT, type, callback) {

   var deferred = Q.defer();

   try {
      //assure we can pass promise to callback
      if (typeof PV === 'function') callback = PV;
      if (typeof rate === 'function') callback = rate;
      if (typeof NPER === 'function') callback = NPER;
      if (typeof PMT === 'function') callback = PMT;
      if (typeof type === 'function') callback = type;

      PV = Number(PV);
      rate = Number(rate);
      NPER = Number(NPER);
      PMT = Number(PMT);
      type = type != null ? Number(type) : 0;

      //validate arguments
      if (!calculator.isRequiredPositiveNumber(PV)) throw new Error('PV' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
      if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
      if (!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
      if (!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
      if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
      type = type || 0;

      var result = PV * Math.pow(1 + rate, NPER) - PMT * ((Math.pow(1 + rate, NPER) - 1) / rate);

      result = result.round(2);


      deferred.resolve(result);
      if (callback) return deferred.promise.nodeify(callback);
      return result;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }

};

/*
 FirstPaymentDate
 ----------------
 This function calculates the first payment date of a loan. It defaults to
 the first day of the month which is at least one full month from the date
 the loan was funded (origination or funding date).

 This function takes the following arguments:
 * dateFunded (required) - the funding or origination date of the loan
 * firstPaymentDay (optional) - desired day of the month for the payment - defaults to the first day
 * cb (optional) - optional CommonJS (Node style) callback
 */
calculator.FirstPaymentDate = function (dateFunded, firstPaymentDay, cb) {

   var deferred = Q.defer();

   dateFunded = dateFunded ? moment(dateFunded) : new Date();

   cb = firstPaymentDay && typeof firstPaymentDay === 'function'
      ? firstPaymentDay
      : typeof cb === 'function' ? cb : null;

   firstPaymentDay = firstPaymentDay && firstPaymentDay !== 'function' ? firstPaymentDay : 1;

   try {
      dateFunded = moment(dateFunded);
      var result = dateFunded.date() > 1 ? dateFunded.add('M', 2).date(firstPaymentDay)
         : dateFunded.add('M', 1).date(1);

      result = result.toISOString();

      deferred.resolve(result);
      if (cb) return deferred.promise.nodeify(cb);
      return  result;

   } catch (err) {
      deferred.reject(new Error(err));
      if (cb) return deferred.promise.nodeify(cb);
      return null;
   }
};

/*
 Payments
 --------
 Calculates the number of payments for a loan. This is different than NPER.
 NPER calculates the number of periods used in an annuity or loan from
 a financial perspective. This function looks at how frequently a customer
 chooses to make payments. This function has the following arguments:
 * NPER (required) - the number of periods used in calculating interest for a loan
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
calculator.Payments = function (NPER, frequency, callback) {
   var deferred = Q.defer();
   var payments;
   try {

      //assure we can pass promise to callback
      if (typeof NPER === 'function') callback = NPER;
      if (typeof frequency === 'function') frequency = NPER;
      frequency = frequency.toLowerCase();

      NPER = NPER ? Number(NPER) : 0;

      if (frequency == null || frequency === 'monthly') {
         payments = NPER;
      } else if (frequency === 'semimonthly') {
         (payments = NPER * 2).toInteger();
      } else if (frequency === 'bimonthly') {
         payments = (NPER / 2).toInteger();
      } else if (frequency === 'quarterly') {
         payments = (NPER / 4).toInteger();
      } else if (frequency === 'semiannually') {
         payments = (NPER / 6).toInteger();
      } else if (frequency === 'annually') {
         payments = (NPER / 12).toInteger();
      } else if (frequency === 'none' || frequency === 'one') {
         payments = 1;
      }

      deferred.resolve(payments);
      if (callback) return deferred.promise.nodeify(callback);
      return payments;

   } catch (err) {
      deferred.reject(err);
      if (callback) return deferred.promise.nodeify(callback);
      return err;
   }
};

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

calculator.EarnedAmount = function (obj, cb) {
   var deferred = Q.defer();

   try {
      var InitialLoanAmount = obj.InitialLoanAmount || 0;
      var OriginationDate = moment(obj.OriginationDate) || moment();
      var InterestPrepaymentAmount = obj.InterestPrepaymentAmount || 0;
      var FirstPaymentDate = moment(obj.FirstPaymentDate) || moment();
      var Term = obj.Term || 0;
      var Frequency = obj.Frequency || 'monthly';
      var Payments = calculator.Payments(Term, Frequency);
      var Rate = obj.Rate || 0;
      var DeterminationDate = moment(obj.DeterminationDate) || moment();
      var daysBeforeFirstPayment = FirstPaymentDate.diff(OriginationDate, 'days');
      var periodicRate = Rate / 100 / (12 * Payments / Term);
      var dailyRate = Rate / 100 / 365;
      var interestEarnedBeforeFirstPayment = daysBeforeFirstPayment * InitialLoanAmount * dailyRate - InterestPrepaymentAmount;
      var numberOfMonths = DeterminationDate.diff(FirstPaymentDate, 'months');
      var numberOfExtraDays = DeterminationDate.diff(FirstPaymentDate, 'days') - numberOfMonths * 30;
      var Payment = calculator.PMT(InitialLoanAmount, Payments, periodicRate);
      var cumInterestPaid = calculator.CumulativeInterestPaid(periodicRate, Payments, InitialLoanAmount);

      var remainingBalance = calculator.RemainingBalance(InitialLoanAmount, periodicRate, numberOfMonths, Payment);
      var interestEarnedAfterLastPayment = numberOfExtraDays * remainingBalance * dailyRate;
      var totalAmountEarned = interestEarnedBeforeFirstPayment + cumInterestPaid + InitialLoanAmount - remainingBalance + interestEarnedAfterLastPayment;
      deferred.resolve(totalAmountEarned);
      if (cb) return deferred.promise.nodeify(cb);
      return totalAmountEarned;
   } catch (err) {
      deferred.reject(err);
      if (cb) return deferred.promise.nodeify(cb);
      return err;
   }
};


/*
 PastDue
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

calculator.IsLoanPastDue = function (loan, cb) {
   var deferred = Q.defer();

   try {
      var pastDue = false;
      var earnedAmount = calculator.EarnedAmount(loan);
      var amountPaid = 0;

      loan.transactions.forEach(function (tx) {
         amountPaid += tx.amount;
      });
      pastDue = amountPaid < earnedAmount;
      deferred.resolve(pastDue);
      if (cb) return deferred.promise.nodeify(cb);
      return pastDue;
   } catch (err) {
      deferred.reject(err);
      if (cb) return deferred.promise.nodeify(cb);
      return err;
   }
};

/*
 NextPaymentDate
 -------
 This calculates the Next Payment Date of a loan. If the loan is past due, the next
 date is the date of determination. If a loan is not past due, it is the first
 payment date in the amortization table which is greater than the date of
 determination.

 This function takes the following arguments:
 * loan object (required) - a Javascript object with the following required properties:
 - amortizationTable - the loan amortization table.
 - pastDue - if the loan is past due.
 */

calculator.NextPaymentDate = function (loan, cb) {
   var deferred = Q.defer();
   var nextPaymentDate = new Date();
   try {
      var now = moment();
      if(loan.pastDue){
         nextPaymentDate = new Date();
         deferred.resolve(nextPaymentDate);
      } else {
         for(var i = 0; i < loan.amortizationTable.length; i++){
            if(moment(loan.amortizationTable[i].date).isAfter(now)){
               nextPaymentDate = loan.amortizationTable[i].date;
               deferred.resolve(nextPaymentDate);
               break;
            }
         }
      }
      if (cb) return deferred.promise.nodeify(cb);
      return nextPaymentDate;
   } catch (err) {
      deferred.reject(err);
      if (cb) return deferred.promise.nodeify(cb);
      return err;
   }
};

/*
 PayOffAmount
 -------
 This calculates the pay off amount of a loan.

 This function takes the following arguments:
 * loan object with the following:
   - loanAmount - principal amount of the loan on the date of origination
   - interestRate - annualized interest rate of the loan
   - term - the term of the loan
   - originationDate - the date the loan was originated
   - firstPaymentDate - the date the first payment is/was due on the loan
   - type - 0 if the loan is paid at the end of the period and 1 if it is paid at the beginning
   - transactions - array of transactions, including:
      * receivedDate - date transaction occured
      * amount - amount of transaction (can be negative or positive)
* determinationDate (optional) - the date the payoff is desired or scheduled
 */
calculator.PayOffAmount = function(loan){

};

/*
PaymentsInYear
--------------
This calculates the number of payments made in a year.
It requires:
   - frequency - monthly, semimonthly, etc.
*/
calculator.PaymentsInYear = function(frequency){
   var result = 12;
   if(!frequency) result = 12;
   frequency = frequency.toLowerCase();   
   if(frequency === 'month') result = 12;
   if(frequency === 'semimonthly') result = 24;
   if(frequency === 'bimonthly') result = 6;
   if(frequency === 'quarterly') result = 4;
   if(frequency === 'semiannually') result = 2;
   if(frequency === 'annually') result = 1;
   return result;
};

/*
AccruedInterest
---------------
Determines the amount of interest accrued between two dates. Requires:
   - firstDate
   - secondDate: should be a date after the first date
   - rate: annual interest rate
   - balance at beginning of period
*/
calculator.AccruedInterest = function(firstDate, secondDate, rate, balance){
//   console.log(firstDate, secondDate, rate, balance);
   firstDate = moment(firstDate);
   secondDate = moment(secondDate);
   var daysOfInterest = Math.abs(secondDate.diff(firstDate, 'days'));
   rate = rate / 100 / 365 * daysOfInterest;
//   console.log(daysOfInterest, rate);
   return balance * rate;
};

/*
Payment
-------
Calculates payment on a loan. Parameters include:
   - loanAmount
   - term: months
   - frequency: 'monthly, semimonthly, bimonthly, quarterly, semiannually, annually'
   - interestRate: annualized percentage, e.g., 10
   - interestOnly: if only interest is going to be paid
   - type: 0 for lagged payments, 1 for up front payments
*/
calculator.Payment = function(loanAmount, term, frequency, interestRate, interestOnly, type){
   var payments = this.Payments(term, frequency);
   var rate = interestRate / 100 / this.PaymentsInYear(frequency);

   var NPER = type === 0 ? payments : payments + 1;

   var result;

   if (rate === 0){
      if (NPER > 0 ){
         result = loanAmount / NPER;
      } else {
         result = loanAmount;
      }
   } else {
      if (interestOnly){
         result = (loanAmount * (rate * Math.pow(1 + rate, NPER)) / (Math.pow(1 + rate, NPER) - 1)) - loanAmount;
      } else {
         result = loanAmount * (rate * Math.pow(1 + rate, NPER)) / (Math.pow(1 + rate, NPER) - 1);
      }
   }
   return result.round(2);
};

/*
 CalcNumberOfTransactions
 ------------------------
 Calculates the number of transactions that can be made between a first date and now.
 Requires:
   - fistPaymentDate: the date the first payment is to be made
   - term: the term in months for the loan
   - frequency: how often payments are to be made
*/

calculator.CalcNumberOfTransactions = function(firstPaymentDate, term, frequency){
   frequency = String(frequency).toLowerCase();
   firstPaymentDate = moment(firstPaymentDate);
   var now = moment();
   var payments = this.Payments(term, frequency);
   var transactions;

   if(frequency === 'semimonthly') transactions = now.diff(firstPaymentDate, 'months') * 2;
   if(frequency === 'monthly') transactions = now.diff(firstPaymentDate, 'months');
   if(frequency === 'bimonthly') transactions = now.diff(firstPaymentDate, 'months') / 2;
   if(frequency === 'quarterly') transactions = now.diff(firstPaymentDate, 'months') / 3;
   if(frequency === 'semiannually') transactions = now.diff(firstPaymentDate, 'months') / 6;
   if(frequency === 'annually') transactions = now.diff(firstPaymentDate, 'months') / 12;

   transactions = transactions < 0 ? 0
      : transactions > payments ? payments : transactions;

   return transactions;
};

/*
CreateTx
--------
Creates a transaction.
   Requires:
      - paymentNumber: the number of this payment
      - payment: amortized payment amount
      - lastPaymentDate: date of the last payment
      - beginningPrincipal: loan amount on the lastPaymentDate
      - frequency: how often payments are made
      - interestRate: annualized interest rate of the loan expressed as a percentage, i.e., 10.1
   Returns: transaction object containing:
      - paymentNumber: j + 1,
      - amount: payment,
      - receivedDate: date payment is received,
      - interest: amount of payment allocated to interest
      - principal: amount of payment allocated to paying down principal
      - startingPrincipal: beginningPrincipal
      - loanBalance: principal balance remaining after payment
*/

calculator.CreateTx = function(paymentNumber, payment, lastPaymentDate, beginningPrincipal, frequency, interestRate){
   lastPaymentDate = moment(lastPaymentDate);

   var receivedDate;
   if(frequency === 'semimonthly') receivedDate = moment(lastPaymentDate).add('days', 15);
   if(frequency === 'monthly') receivedDate = moment(lastPaymentDate).add('months', 1);
   if(frequency === 'bimonthly') receivedDate = moment(lastPaymentDate).add('months', 2);
   if(frequency === 'quarterly') receivedDate = moment(lastPaymentDate).add('months', 3);
   if(frequency === 'semiannually') receivedDate = moment(lastPaymentDate).add('months', 6);
   if(frequency === 'annually') receivedDate = moment(lastPaymentDate).add('months', 12);

   var interest = this.AccruedInterest(lastPaymentDate.toISOString(), receivedDate.toISOString(), interestRate, beginningPrincipal);
   var principal = Number(payment) - interest;
   return {
      paymentNumber: Number(paymentNumber) + 1,
      amount: payment,
      payment: payment,
      receivedDate: receivedDate.toISOString(),
      interest:  interest,
      principal: principal,
      startingPrincipal: beginningPrincipal,
      loanBalance: Number(beginningPrincipal) - principal
   }
};

//rounds numbers to decimal places
Number.prototype.round = function (decimalPlaces) {
   var places = decimalPlaces != null && !isNaN(decimalPlaces) && decimalPlaces >= 0 ? decimalPlaces : 2;
   return (Math.round(this * Math.pow(10, places)) / Math.pow(10, places));
};

//eliminate this when Node supports Harmony
Number.prototype.isInteger = function () {
   return parseFloat(this) === parseInt(this);
};

//eliminate this when Node supports Harmony and Harmony has adopted toInteger()
Number.prototype.toInteger = function () {
   return Math.ceil(this);
};

Number.prototype.isOdd = function () {
   return this % 2;
};

module.exports = calculator;

