import transaction from "./transaction";

enum lateChargeType {
  fixed = "FIXED",
  percentage = "PERCENTAGE",
}

export default interface loan {
  closingDate: date;
  daysUntilLate: number;
  firstPaymentDate: date;
  interestRate: number;
  lateChargeAmount: number;
  lateChargeMax?: number;
  lateChargeMin?: number;
  lateChargeType: lateChargeType;
  loanAmount: number;
  paymentAmount: number;
  transactions: [transaction];
}
