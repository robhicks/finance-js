/**
 * dateLastPaymentWasReceived
 * @param loan
 * - transactions
 */
export function dateLastPaymentWasReceived(loan, cb) {
  var d = Q.defer();
  var last;
  if (!loan) {
    d.reject("required parameters for dateLastPaymentWasReceived not provided");
  }

  var paymentTxs = loan.transactions.filter(function (tx) {
    return tx.type !== "Late Fee";
  });

  last = _.max(paymentTxs, function (rec) {
    return rec.txDate;
  });

  loan.dateLastPaymentWasReceived = last.txDate || loan.closingDate;
  d.resolve(loan);
  if (cb) return cb(loan);
  return d.promise;
}
