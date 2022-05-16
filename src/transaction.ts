enum paymentType {
  payment = "LOAN_PAYMENT",
  lateFee = "LATE_FEE",
}

export default interface transaction {
  amount: Number;
  comments?: String;
  interest: Number;
  loanBalance?: Number;
  principal: Number;
  type: paymentType;
  txDate: Date;
}
