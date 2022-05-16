import { addDays } from "./addDays";
import { addMonths } from "./addMonths";
import { calcLateFee } from "./calcLateFee";
import { elapsedMonths } from "./elapsedMonths";
import { paymentMadeOnTime } from "./paymentMadeOnTime";
import { beforeDate } from "./beforeDate";
import { lateFeeAppliedForDate } from "./lateFeeAppliedForDate";
import { getLoanBalance } from "./getLoanBalance";

import loan from "./loan";

export function addLateFees(loan: loan, date?: date): loan {
  const lateFee = calcLateFee(loan);
  const determinationDate = new Date(date);
  const lateFeeTxs = loan.transactions.filter((tx) => tx.type === "LATE_FEE");
  const pmtTransactions = loan.transactions.filter(
    (tx) => tx.type !== "LATE_FEE"
  );
  const months = elapsedMonths(determinationDate, loan.firstPaymentDate);

  for (i = 0; i < months; i++) {
    const pmtDate = addMonths(loan.firstPaymentDate, i);
    const graceDate = addDays(pmtDate, loan.daysUntilLate);
    if (
      !paymentMadeOnTime(
        pmtTransactions,
        pmtDate,
        graceDate,
        loan.paymentAmount
      ) &&
      beforeDate(pmtDate, determinationDate) &&
      !lateFeeAppliedForDate(loan, graceDate)
    ) {
      loan.transactions.push({
        txDate: graceDate.toUTCString(),
        type: "LATE_FEE",
        amount: -1 * lateFee,
        comments:
          "Late fee imposed for failure to pay on time or to pay proper amount",
        loanBalance: getLoanBalance(loan, txDate),
      });
    }
  }

  return loan;
}
