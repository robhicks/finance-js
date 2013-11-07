"use strict";

var Q = require('q');
var _ = require('lodash');
var util = require('util');
var moment = require('moment');

var calculator = {};

calculator.self = calculator;

calculator.isFunction = function(callback){
    return (typeof callback === 'function');
};

calculator.isPositiveNumber = function(number){
    if(!number) return true;
    return (!isNaN(number) && number > 0);
};

calculator.isPositiveInteger = function(number){
    if(!number) return true;
    return (!isNaN(number) && number.isInteger() && number > 0);
};

calculator.isProperType = function(type){
    if(!type) return true;
    return (!isNaN(type) && (type === 0 || type === 1));
};

calculator.isRequiredPositiveNumber = function(number){
    return (number && calculator.isPositiveNumber(number));
};

calculator.isRequiredPositiveInteger = function(number){
    return (number && calculator.isPositiveInteger(number));
};

calculator.validationErrors = [
    ' must be a positive number',
    ' must be a positive integer',
    ' must be 0 or 1',
    ' must be a function'
];

/*
    PVofLumpSum
    Calculates the present value of a lump sum received in the future. Arguments include:
        rate (required) - the interest rate per period
        NPER (required) - total number of periods
        FV (optional) - the future value or lump sum to be received
 */
calculator.PVofLumpSum = function(rate, NPER, FV, callback){
    var deferred = Q.defer();

    try{
        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof NPER === 'function') callback = NPER;
        if(typeof FV === 'function') callback = FV;

        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if(!calculator.isPositiveNumber(FV)) throw new Error('FV' + calculator.validationErrors[0]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

        var result = FV / Math.pow(1 + rate, NPER);
        deferred.resolve(result);

        if(callback) return deferred.promise.nodeify(callback);
        return result;

    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};

/*
 PV
 Calculates the present value of an investment resulting from a series of regular payments. Arguments include:
     rate (required) - the interest rate per period
     NPER (required) - total number of payment periods
     PMT (required)  the regular payment made each period
     type (optional) - when payments are made:
         0 - at the end of each period
         1 - at the start of each period (including a payment at the start of the term)
 */
calculator.PV = function(rate, NPER, PMT, type, callback){
    var deferred = Q.defer();
    try{

        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof NPER === 'function') callback = NPER;
        if(typeof PMT === 'function') callback = PMT;
        if(typeof type === 'function') callback = type;

        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if(!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
        if(!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
        type = type || 0;

        var annuityImmediate = PMT * ( (1 - Math.pow(1 + rate, -NPER)) / rate );
        var annuityDue = annuityImmediate * (1 + rate);

        var result = type === 0 ? annuityImmediate : annuityDue;

        deferred.resolve(result);
        if(callback) return deferred.promise.nodeify(callback);

        return result;

    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};


/*
    PVofPerpetuity
    Calculates the present value of an investment with an unlimited number of regular payments. Arguments include:
     rate (required) - the interest rate per period
     NPER (required) - total number of payment periods
     PMT (required)  the regular payment made each period
 */
calculator.PVofPerpetuity = function(rate, PMT, callback){
    var deferred = Q.defer();

    try{
        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof PMT === 'function') callback = PMT;

        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

        var result = PMT / rate;

        deferred.resolve(result);
        if(callback) return deferred.promise.nodeify(callback);
        return result;

    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};

/*
    Calculate the total interest paid on a loan in specified periodic payments. Arguments include:
        rate (required) - interest rate specified as a percentage, e.g., 10.5
        periods (required) - the total number of payment periods in the term
        pv (required) - the initial sum borrowed
        start (optional) - the first period to include. Periods are numbered beginning with 1
        end (optional) - the last period to include
        type (optional) - when payments are made:
            0 - at the end of each period
            1 - at the start of each period (including a payment at the start of the term)
        callback (optional) - callback for asynchronous processing using Node's CommonJS format
 */
calculator.CUMIPMT = function(rate, periods, PV, start, end, type, callback){
    var deferred = Q.defer();
    try{
        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof periods === 'function') callback = periods;
        if(typeof PV === 'function') callback = PV;
        if(typeof start === 'function') callback = start;
        if(typeof end === 'function') callback = end;
        if(typeof type === 'function') callback = type;
        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);

        if(!rate || isNaN(rate) || rate < 0) throw new Error('rate must be a positive number');
        if(!periods || isNaN(periods) || !periods.isInteger() || periods < 1) throw new Error('periods must be a positive integer');
        if(! PV || isNaN(PV) || PV < 1) throw new Error('PV must be a positive number');
        if(isNaN(start) || !start.isInteger() || start < 1 || start > periods) throw new Error('start must be a positive integer that is greater 0 and less than periods');
        if(isNaN(end) || !end.isInteger() || end > periods || (end < start || end < 1)) throw new Error('end must be a positive integer that is greater 0 or start, if provided, and less than or equal to periods');
        if(isNaN(type) || type !== 0 || type !== 1) throw new Error('type must be 0 or 1');


        var result;

        deferred.resolve(result);

    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};

calculator.calcAccruedInterest = function (principle, months, rate, cb) {
    try{
        var deferred = Q.defer();

        if(typeof principle === 'function') cb = principle;
        if(typeof months === 'function') cb = months;
        if(typeof rate === 'function') cb = rate;
        if(! principle || isNaN(principle) || principle < 1) throw new Error('principle must be a positive number');
        if(!months || isNaN(months) || !months.isInteger() || months < 1) throw new Error('months must be a positive integer');
        if(!rate || isNaN(rate) || rate < 0) throw new Error('rate must be a positive number');

        var i = rate / 1200;
        var result = (principle * Math.pow(1 + i, months)) - principle;
        deferred.resolve(result);
        if(cb) return deferred.promise.nodeify(cb);
        return result;

    } catch (err){
        deferred.reject(err);
        if(cb) return deferred.promise.nodeify(cb);
        return err;
    }
};

/*
    Calculates the amount of a loan, using the following arguments:
        months (required) - the number of months of the loan
        rate (required) - the interest rate of the loan, provided as a percentage, e.g., 10.5
        payment (required) - the monthly payments made for the loan
 */
calculator.calcAmount = function (months, rate, payment, cb) {
    var deferred = Q.defer();
    try{
        if(typeof months === 'function') cb = months;
        if(typeof rate === 'function') cb = rate;
        if(typeof payment === 'function') cb = payment;
        if(!months || isNaN(months) || !months.isInteger() || months < 1) throw new Error('months must be a positive integer');
        if(!rate || isNaN(rate) || rate < 0) throw new Error('rate must be a positive number');
        if(!payment || isNaN(payment) || payment < 0) throw new Error('payment must be a positive number');

        rate = rate / 1200;
        var result = ((rate * Math.pow((rate + 1), months)) / Math.pow((rate + 1), months));

        deferred.resolve(result);

        if(cb) return deferred.promise.nodeify(cb);
        return result;

    } catch (err) {
        if(cb) return deferred.promise.nodeify(cb);
        return err;
    }
};

/*
    Calculates future value of an investment based on equal periodic payments. Arugments include:
      rate (required) - the periodic interest rate
      NPER (required) - the number of periods
      PMT (required) - the equal periodic payments
      type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period
 */
calculator.FV = function(rate, NPER, PMT, type, callback){
    var deferred = Q.defer();
    try{
        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof NPER === 'function') callback = NPER;
        if(typeof PMT === 'function') callback = PMT;
        if(typeof PV === 'function') callback = PV;
        if(typeof type === 'function') callback = type;

        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if(!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
        if(!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
        type = type || 0;

        var result = calculator.PV(rate, NPER, PMT, type) * Math.pow(1 + rate, NPER);

        deferred.resolve(result);
        if(callback) return deferred.promise.nodeify(callback);
        return result;

    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};


/*
    Caculates the number of periods for an investment based on periodic, constant payments
    and a constant interest rate. Arguments include:
        rate (required) - the periodic interest rate
        PMT (required) - the constant payment paid in each period
        FV (required) - the future value of the last period
        type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period
 */
//determine the months financed
calculator.NPER= function (rate, PMT, FV, type, callback) {
    var deferred = Q.defer();
    try{
        //assure we can pass promise to callback
        if(typeof rate === 'function') callback = rate;
        if(typeof PMT === 'function') callback = PMT;
        if(typeof FV === 'function') callback = FV;
        if(typeof type === 'function') callback = type;

        //validate arguments
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveNumber(PMT)) throw new Error('PMT' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveNumber(FV)) throw new Error('FV' + calculator.validationErrors[0]);
        if(!calculator.isProperType(type)) throw new Error('type', calculator.validationErrors[2]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
        type = type || 0;

        var result = type == 0
            ? Math.round(-Math.log(1 - rate * FV / PMT) / Math.log(1 + rate))
            : Math.round(-Math.log(1 - rate * FV / PMT) / Math.log(1 + rate)) - 1
        //var result = Math.round(Math.log(1 + ((FV * rate) / PV)) / Math.log(1 + rate));
        deferred.resolve(result);
        if(callback) return deferred.promise.nodeify(callback);
        return result;

    } catch (err){

        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};
/*
    Calculates the number of payments of a loan based upon the frequency of the loan. Arguments include:

 */

// determine the interest rate financed http://www.hughchou.org/calc/formula.html
calculator.calcInterest = function (amount, months, payment, cb) {
    var deferred = Q.defer();
    try{
        
        
        var result = 0;

        var min_rate = 0, max_rate = 100;
        while (min_rate < max_rate - 0.0001) {
            var mid_rate = (min_rate + max_rate) / 2,
                j = mid_rate / 1200,
                guessed_pmt = amount * ( j / (1 - Math.pow(1 + j, months * -1)));

            if (guessed_pmt > payment) {
                max_rate = mid_rate;
            }
            else {
                min_rate = mid_rate;
            }
        }
        result = mid_rate;
        deferred.resolve(result);

        if(cb) return deferred.promise.nodeify(cb);
        return result;

    } catch (err){
        if(cb) return deferred.promise.nodeify(cb);
        return null;
    }
};

/*
    Calculates the payment for a loan with the following parameters.
        PV is loan amount
        NPER is the number of periods
        rate is the rate per period
 */
calculator.PMT = function(PV, NPER, rate, callback){
    var deferred = Q.defer();
    try{
        //assure we can pass promise to callback
        if(typeof PV === 'function') callback = PV;
        if(typeof rate === 'function') callback = rate;
        if(typeof NPER === 'function') callback = NPER;
        //validate arguments
        if(!calculator.isRequiredPositiveNumber(PV)) throw new Error('PV' + calculator.validationErrors[0]);
        if(!calculator.isRequiredPositiveInteger(NPER)) throw new Error('NPER' + calculator.validationErrors[1]);
        if(!calculator.isRequiredPositiveNumber(rate)) throw new Error('rate' + calculator.validationErrors[0]);
        if(callback && !calculator.isFunction(callback)) throw new Error('callback', calculator.validationErrors[3]);
        
        var result = PV * (rate * Math.pow(1 + rate, NPER)) / (Math.pow(1 + rate, NPER) - 1);
        deferred.resolve(result);
        if(callback) return deferred.promise.nodeify(callback);
        return result;
    } catch (err){
        deferred.reject(err);
        if(callback) return deferred.promise.nodeify(callback);
        return err;
    }
};
/*
    This function generates an amortization schedule. The schedule is returned as a Javascript object.

    The function accepts the following arguments:
        amount (required): the starting principal amount of the loan
        months (required): the number of whole months over which the loan extends
        rate (required): the annual interest rate of the loan expressed as a percentage, e.g., 10.5
        firstPaymentDate (optional): the date the first payment will be made
        frequency (optional): the payment frequency, which can be any of the following:
            semimonthly - twice a month
            monthly - once each month
            bimonthly - every two months
            quarterly - every quarter
            semiannually - ever 6 months
            annually - ever 12 months
            none or one - only one payment at the end of the loan - typically don't mix this with balloonDate
        balloonDate (optional): the date a balloon payment will be made. This date will be forced to earliest
            corresponding payment date. This date will be ignored if it is greater than the term (months) of the
            loan.

    The return object contains an array, with each array element containing the following fields:
        paymentNumber - the number for a payment
        principle: the principal balance remaining at the end of the period
        accumulatedInterest: the interest accumulate from all previous periods through this period
        payment: the periodic payment the borrower is required to pay
        paymentToPrinciple: the amount of the payment allocated to paying down the principal
        paymentToInterest: the amount of the payment allocated to paying interest
        date: the date of the payment for the period

 */
calculator.genAmortizationSchedule = function (amount, months, rate, firstPaymentDate, frequency, balloonDate, cb) {

    var argLength = arguments.length;
    var deferred = Q.defer();

    if(typeof amount !== 'number' || amount < 0) deferred.reject(new Error('amount must be a positive number'));
    if(typeof months !== 'number' || !months.toInteger() || months < 0) deferred.reject(new Error('months must be a positive integer'));
    if(typeof rate !== 'number' || rate < 0) deferred.reject(new Error('rate must be a positive number'));

    if(argLength < 3){
        deferred.reject(new Error("must provide 3 arguments"));
    } else if(argLength > 3 && argLength < 7){
        if(typeof firstPaymentDate === 'function') cb = firstPaymentDate;
    } else if(argLength > 4 && argLength < 7){
        if(typeof frequency === 'function') cb = frequency;
    } else if(argLength > 5 && argLength < 7){
        if(typeof balloonDate === 'function') cb = balloonDate;
    } else {
        if(firstPaymentDate.constructor !== Date) deferred.reject(new Error('firstPaymentDate must be Javascript Date'));
        if(typeof frequency !== 'string') deferred.reject(new Error('frequency must be a string matching requirement type'));
        if(balloonDate.constructor !== Date) deferred.reject(new Error('balloonDate must be a Date object'));
        if(typeof cb !== 'function') deferred.reject(new Error('callback must be function'));
    }

    balloonDate = balloonDate !== undefined && balloonDate.constructor === Date ? moment(balloonDate) : null;
    var currDate = firstPaymentDate !== undefined && firstPaymentDate.constructor === Date ? moment(firstPaymentDate) : moment();
    var dateOffset = 1;
    var lastPaymentDate = currDate.clone().add('M', months);
    var paymentDay = currDate.date();
    var payments = 0;
    rate = rate / 100;
    var semimonthly = false;

    if(balloonDate && (balloonDate.isAfter(lastPaymentDate) || balloonDate.isBefore(currDate)))
        deferred.reject(new Error('balloon date must be after first payment date and before last payment date'));

    if(!frequency || frequency === 'monthly'){
        payments = months;
        rate = rate / 12;
        dateOffset = 1;
    } else if(frequency.toLowerCase() === 'semimonthly'){
        (payments = months * 2).toInteger();
        rate = rate / 12 / 2;
        semimonthly = true;
        dateOffset = parseInt(365.25 / 12 / 2);
    } else if(frequency.toLowerCase() === 'bimonthly'){
        payments = (months / 2).toInteger();
        rate = rate / 12 * 2;
        dateOffset = 2;
    } else if(frequency.toLowerCase() === 'quarterly'){
        payments = (months / 4).toInteger();
        rate = rate / 12 * 4;
        dateOffset = 4;
    } else if(frequency.toLowerCase() === 'semiannually'){
        payments = (months / 6).toInteger();
        rate = rate / 12 * 6;
        dateOffset = 6;
    } else if(frequency.toLowerCase() === 'annually'){
        payments = (months / 12).toInteger();
        rate = rate / 12 * 12;
        dateOffset = 12;
    } else if(frequency.toLowerCase() === 'none' || frequency.toLowerCase() === 'one'){
        payments = 1;
        rate = rate * (months / 12);
        dateOffset = payments;
    }

    try{
        var obj = {};
        var payment = calculator.calcPayment(amount, payments, rate);
        var balance = amount;
        var totalInterest = 0.0;
        obj.schedule = [];
        var currInterest = 0;
        var currPrinciple = 0;

        for (var i = 0; i < payments; i++) {
            currInterest = balance * rate;
            totalInterest += currInterest;
            currPrinciple = payment - currInterest;
            balance -= currPrinciple;

            obj.schedule.push({
                paymentNumber: i + 1,
                principle: balance.round(2),
                accumulatedInterest: totalInterest.round(2),
                payment: payment.round(2),
                paymentToPrinciple: currPrinciple.round(2),
                paymentToInterest: currInterest.round(2),
                date: currDate.toISOString()
            });

            if(semimonthly){
                if(i.isOdd()){
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
        if(cb) return deferred.promise.nodeify(cb);
        return obj;
    } catch (e){
        deferred.reject(new Error(err));
        if(cb) return deferred.promise.nodeify(cb);
        return null;
    }
};

/*
    This function calculates the remaining balance of a loan. It can be used to
    calculate a balloon payment because the amount due at the end of a balloon
    loan is effectively the same as calculating the balance of a conventional
    loan after the same period.

    amount - the principal amount of the loan
    rate - the interest rate per term
    term - term (periods) of the loan (amortization period)
    payments - number of payments to the period in question - this should always be shorter than the term
 */
calculator.calcRemainingBal = function(amount, rate, term, payments, cb){

    var deferred = Q.defer();

    try{
        var payment = calculator.calcPayment(amount, term, rate);
        var iFactor = Math.pow((1 + rate), payments);
        var remainingBalance = amount * iFactor - payment * ((iFactor - 1) / rate);

        deferred.resolve(remainingBalance);
        if(cb) return deferred.promise.nodeify(cb);
        return remainingBalance;

    } catch (err){
        deferred.reject(new Error(err));
        if(cb) return deferred.promise.nodeify(cb);
        return null;
    }

};

/*
    This function calculates the first payment date of a loan. It defaults to
    the first day of the month which is at least one full month from the date
    the loan was funded (origination or funding date).

    This function takes the following arguments:
        dateFunded (required) - the funding or origination date of the loan
        firstPaymentDate (optional) - desired day of the month for the payment - defaults to the first day
        cb (optional) - optional CommonJS (Node style) callback
*/
calculator.firstPaymentDate = function(dateFunded, firstPaymentDay, cb){

    var deferred = Q.defer();
    var firstPaymentMonth;
    var firstPaymentYear;
    var result;

    if(!dateFunded || dateFunded.constructor !== Date) deferred.reject(new Error('dateFunded must be Date object'));
    if(firstPaymentDay){
        if(firstPaymentDay === 'function'){
            cb = firstPaymentDay;
        } else if(!firstPaymentDay.isInteger() || firstPaymentDay < 1){
            deferred.reject(new Error('firstPaymentDay must be a positive integer'));
        }
    } else {
        firstPaymentDay = 1;
    }

    if(cb && typeof cb !== 'function') deferred.reject(new Error('Callback must be a function'));

    try{
        dateFunded = moment(dateFunded);
        if(firstPaymentDay == 1){
            result = dateFunded.add('M', 1).date(firstPaymentDay);
        } else {
            result = dateFunded.add('M', 2).date(firstPaymentDay)
        }

        deferred.resolve(result.toISOString());
        if(cb) return deferred.promise.nodeify(cb);
        return  result;

    } catch(err){
        deferred.reject(new Error(err));
        if(cb) return deferred.promise.nodeify(cb);
        return null;
    }
};

//rounds numbers to two decimal places
Number.prototype.round = function(decimalPlaces){
    var places = decimalPlaces && !isNaN(decimalPlaces && decimalPlaces > 0) ? decimalPlaces : 1;
    return Math.round(this * Math.pow(10, places)) / Math.pow(10, places);
};

//eliminate this when Node supports Harmony
Number.prototype.isInteger = function(){
    return parseFloat(this) === parseInt(this)
};

//eliminate this when Node supports Harmony and Harmony has adopted toInteger()
Number.prototype.toInteger = function(){
    return Math.ceil(this);
};

Number.prototype.isOdd = function(){
    return this % 2;
};

module.exports = calculator;

