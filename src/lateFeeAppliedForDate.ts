export function lateFeeAppliedForDate(loan, txDate) {
  txDate = txDate._isAMomentObject ? txDate : moment(txDate);
  var result = false;
  var lateFeeTxs = loan.transactions.filter(function (tx) {
    return tx.type === "Late Fee";
  });
  lateFeeTxs.forEach(function (tx) {
    if (moment(tx.txDate).isSame(txDate)) result = true;
  });
  return result;
}
