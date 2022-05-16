/**
 * returns the next payment for a loan
 * @param  {Date} dateLastPaymentReceived - the ddate of the last payment
 * @param {Array} - an array of payment transations with the date of payment having key txDate
 * @return {Date} the next payment date
 */
export function nextPaymentDate({
  dateLastPaymentReceived = new Date(),
  amortizationTable = []
} = {}) {
  let nextPmtDate = null;

  for (let i = 0, len = amortizationTable.length; i < len; i++) {
    const item = amortizationTable[i];
    const txDate = new Date(item.txDate);
    if (txDate > dateLastPaymentReceived) {
      nextPmtDate = item.txDate;
      break;
    }
  }
  return nextPmtDate;
}
