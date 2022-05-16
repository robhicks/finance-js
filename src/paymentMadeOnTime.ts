import { afterDate } from "./afterDate";
import { beforeDate } from "./beforeDate";
import transaction from "./transaction";

export function paymentMadeOnTime(
  pmtTransactions: [transaction],
  paymentDate: date,
  graceDate: date,
  amount: number
) {
  let result = false;
  for (let i = 0, len = pmtTransactions.length; i < len; i++) {
    const tx = pmtTransactions[i];
    const txDate = new Date(tx.txDate);

    if (
      beforeDate(txDate, graceDate) &&
      afterDate(txDate, paymentDate) &&
      tx.amount >= amount
    ) {
      result = true;
      break;
    }
  }
  return result;
}
