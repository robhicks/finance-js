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
export function cumulativeInterestPaid(loan, params, callback) {
  var deferred = Q.defer();
  if (
    !loan ||
    !loan.interestRate ||
    !loan.term ||
    !loan.payments ||
    !loan.loanAmount ||
    !params.startPeriod ||
    !params.endPeriod
  ) {
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
        ? PV * (Math.pow(1 + rate, NPER) - 1) * (1 + rate)
        : PV * (Math.pow(1 + rate, NPER) - 1);
    };

    var presentValueBeforeStart =
      start != null ? ip(rate, start, PV, type) + PV : null;

    var result = presentValueBeforeStart
      ? ip(
          rate,
          end != null ? end - start : NPER - start,
          presentValueBeforeStart,
          type
        )
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
