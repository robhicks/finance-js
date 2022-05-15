
export function pastDueAmount(loan) {
  const now = new Date();
  const paymentsDue = loan.amortizationTable.filter(tx => new Date(tx.txDate) < now);
  const paymentsMade = loan.translations.filter(tx => new Date(tx.txDate) < now && tx.type !== 'Late Fee');

  const sumPaymentsDue = paymentsDue.reduce((agg, pmt) => agg += Number(pmt.amount), 0);
  const sumPaymentsMade = paymentsMade.reduce((agg, pmt) => agg += Number(pmt.amount), 0);

  loan.pastDueAmount = sumPaymentsDue - sumPaymentsMade;

  return loan;
}