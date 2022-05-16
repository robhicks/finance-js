import { beforeDate } from "./beforeDate";
import loan from "./loan";

export function getLoanBalance(loan: loan, determinationDate: date): number {
  const originalLoanAmount = loan.loanAmount;
  var principalPayments = 0;

  const transactions = loan.transactions.filter(
    (tx) => tx.type === "LOAN_PAYMENT"
  );

  transactions.forEach((tx) => {
    const txDate = new Date(tx.txDate);
    if (beforeDate(txDate, determinationDate)) {
      principalPayments += tx.principal;
    }
  });
  return originalLoanAmount - principalPayments;
}
