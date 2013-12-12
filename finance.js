"use strict";

var Q = require('q');
var _ = require('lodash');
var util = require('util');
var moment = require('moment');

var calculator = {};

calculator.self = calculator;

calculator.isFunction = function (func) {
    return (typeof func === 'function');
};

calculator.isPositiveNumber = function (number) {
    return (number != null && !isNaN(number) && number > 0);
};

calculator.isPositiveInteger = function (number) {
    return (number != null && !isNaN(number) && number.isInteger() && number > 0);
};

calculator.isProperType = function (type) {
    return (type != null && !isNaN(type) && (type === 0 || type === 1));
};

calculator.isRequiredPositiveNumber = function (number) {
    return (number != null && calculator.isPositiveNumber(number));
};

calculator.isRequiredPositiveInteger = function (number) {
    return (number != null && calculator.isPositiveInteger(number));
};

calculator.validationErrors = [
    ' must be a positive number',
    ' must be a positive integer',
    ' must be 0 or 1',
    ' must be a function'
];

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
        if(start && (!calculator.isPositiveInteger(start) || start < 1 || start > NPER)) throw new Error('start' +  calculator.validationErrors[1]);
        if(end && (!calculator.isPositiveInteger(end) || end < start || end > NPER)) throw new Error('end' +  calculator.validationErrors[1]);
        if (type && !calculator.isProperType(type)) throw new Error('type' + calculator.validationErrors[2]);

        var ip = function (rate, NPER, PV, type){
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
        if (type != null &&!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
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
 * type (optional) - whether the payment is made at the beginning (1) or the end (0) of a period
 */
calculator.PMT = function (PV, NPER, rate, type, callback) {
    var deferred = Q.defer();
    try {
        //assure we can pass promise to callback
        if (typeof PV === 'function') callback = PV;
        if (typeof rate === 'function') callback = rate;
        if (typeof NPER === 'function') callback = NPER;
        if (typeof type === 'function') callback = type;

        rate = Number(rate);
        NPER = Number(NPER);
        PV = Number(PV);
        type = type != null ? Number(type) : 0;

        //validate arguments
        if (!calculator.isRequiredPositiveNumber(PV)) throw new Error('PV' + calculator.validationErrors[0]);
        if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if (!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
        if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

        NPER = type === 0 ? NPER : NPER + 1;

        var result = PV * (rate * Math.pow(1 + rate, NPER)) / (Math.pow(1 + rate, NPER) - 1);
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
        if (!calculator.isRequiredPositiveNumber(PV)) throw new Error('PV' + calculator.validationErrors[0]);
        if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if (!calculator.isPositiveNumber(balloonAmount)) throw new Error('balloonAmount' + calculator.validationErrors[0]);
        if (balloonPeriod && !calculator.isPositiveInteger(balloonPeriod)) throw new Error('balloonPeriod' + calculator.validationErrors[0]);
        if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
        NPER = type === 0 ? NPER : NPER + 1;

        var result = {};

        if (!balloonAmount && !balloonPeriod) throw new Error('balloonAmount or balloonPeriod must be provided');
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

The return object contains an array, with each array element containing the following fields:
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
        if (!calculator.isRequiredPositiveNumber(PV)) throw new Error('PV' + calculator.validationErrors[0]);
        if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if (!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if (firstPaymentDate.constructor !== Date) throw new Error('firstPaymentDate must be Javascript Date');
        if(frequency && typeof frequency !== 'string') throw new Error('frequency must be a string');
        if (balloonDate && balloonDate.constructor !== Date) throw new Error('balloonDate must be Javascript Date');
        if (callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

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
        if(balloonDate){
            if(balloonDate.isAfter(lastPaymentDate) || balloonDate.isBefore(currDate)){
                throw new Error('balloon date must be after first payment date and before last payment date');
            } else {
                tempDate = moment(firstPaymentDate);
                tempDay = tempDate.date();

                for (var a = 0; a < payments; a++){
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

        var obj = {};
        var payment = calculator.PMT(PV, payments, rate);
        var balance = PV;
        var totalInterest = 0.0;
        obj.schedule = [];
        var currInterest = 0;
        var currPrinciple = 0;

        for (var i = 0; i < payments; i++) {
            currInterest = balance * rate;
            totalInterest += currInterest;
            currPrinciple = payment - currInterest;
            balance -= currPrinciple;
            if(i === balloonPeriod){
                payment = payment + balloonAmount + currInterest;
                currPrinciple = payment;
                balance = 0;
            }

            obj.schedule.push({
                paymentNumber: i + 1,
                principle: balance.round(2),
                accumulatedInterest: totalInterest.round(2),
                payment: payment.round(2),
                paymentToPrinciple: currPrinciple.round(2),
                paymentToInterest: currInterest.round(2),
                date: currDate.toISOString()
            });

            if(i === balloonPeriod) break;

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

        deferred.resolve(obj);
        if (callback) return deferred.promise.nodeify(callback);
        return obj;

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

    if (!dateFunded || dateFunded.constructor !== Date) deferred.reject(new Error('dateFunded must be Date object'));
    if (firstPaymentDay){
        if (typeof firstPaymentDay === 'function') {
            cb = firstPaymentDay;
        } else if (!firstPaymentDay.isInteger() || firstPaymentDay < 1) {
            deferred.reject(new Error('firstPaymentDay must be a positive integer'));
        }
    } else {
        firstPaymentDay = 1;
    }

    if (cb && typeof cb !== 'function') deferred.reject(new Error('Callback must be a function'));

    try {
        dateFunded = moment(dateFunded);
        if (firstPaymentDay == 1) {
            dateFunded.add('M', 1).date(firstPaymentDay);
        } else {
            dateFunded.add('M', 2).date(firstPaymentDay);
        }

        var result = dateFunded.toISOString();

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

        NPER = Number(NPER);

        //validate arguments
        if (!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);

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
PastDue
-------
This calculates if a loan is past due. To do so, it takes a loan with certain parameters and
analyzes the loan against a series of transactions. If the total interest and the total principal
paid on the loan is less than what it should be, the loan is past due.

This function takes the following arguments:
* loan object (required) - a Javascript object with the following required properties:
    * PV (required) - the loan amount
    * NPER (required) - the total number of loan periods
    * PMT (required) - the payment per loan period
    * FirstPaymentDate (required) - the date the first payment was required
    * DeterminationDate (required) - the date the determination is to be made
    * GraceDays (optional) - the number of days after a payment a borrower has to make a payment
    * type - (optional) - whether the payment is due at the beginning (1) or the end (0) of a period

* transactions array (required)
 */


//rounds numbers to decimal places
Number.prototype.round = function (decimalPlaces) {
    var places = decimalPlaces != null && !isNaN(decimalPlaces) && decimalPlaces >= 0 ? decimalPlaces : 2;
    return (Math.round(this * Math.pow(10, places)) / Math.pow(10, places));
};

//eliminate this when Node supports Harmony
Number.prototype.isInteger = function () {
    console.log('integer:', parseFloat(this) === parseInt(this));
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

