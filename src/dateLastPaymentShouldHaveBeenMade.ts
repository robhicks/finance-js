/**
 * Calculates the last date a payment should have been
 * @param loan, which must include
 *  - amortizationTable - a loan amortization table with the expected payment dates
 *  - daysUntilLate (optional) - the grace days for the loan - defaults to 0
 *  - determinationDate (optional) - the date the determination is made, defaults to today
 */
export function dateLastPaymentShouldHaveBeenMade(loan, cb) {
  var d = Q.defer();
  var result;
  if (!loan || _.isEmpty(loan.amortizationTable)) {
    d.reject(
      new Error("required dateLastPaymentShouldHaveBeenMade not provided")
    );
  } else {
    var determinationDate = loan.determinationDate
      ? moment(loan.determinationDate)
      : moment();
    var daysUntilLate = loan.daysUntilLate ? Number(loan.daysUntilLate) : 0;
    determinationDate.add("days", daysUntilLate);
    loan.amortizationTable.forEach(function (payment) {
      var paymentDate = moment(payment.date);
      if (paymentDate.isBefore(determinationDate))
        result = paymentDate.toISOString();
    });
    loan.dateLastPaymentShouldHaveBeenMade = result;
    d.resolve(loan);
  }
  if (cb) return cb(loan);
  return d.promise;
}
