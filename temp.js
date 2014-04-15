"use strict";

var finance = require('./finance');

var loan = {
  loanAmount: 5000,
  closingDate: new Date(2011, 9, 4),
  prepaidInterest: 0,
  term: 60,
  frequency: 'monthly',
  interestRate: 4,
  determinationDate: new Date(),
  lateChargeType: 'lateChargeFixed',
  lateChargeFixed: 10,
  lateChargePercent: 5,
  lateChargeMin$: 5,
  lateChargeMax$: 10,
  daysUntilLate: 10,
  transactions: [
    {paymentNumber: 1, txDate: new Date(2012, 0, 1), type: "Regular Payment", amount: 92.09},
    {paymentNumber: 2, txDate: new Date(2012, 1, 1), type: "Regular Payment", amount: 92.09},
    {paymentNumber: 3, txDate: new Date(2012, 2, 1), type: "Regular Payment", amount: 92.09}
  ]
};

finance.paymentAmount(loan)
    .then(finance.numberOfPayments)
    .then(finance.firstPaymentDate)
    .then(finance.addAmorizationTable)
    .then(finance.dateLastPaymentShouldHaveBeenMade)
    .then(finance.dateLastPaymentWasReceived)
    .then(finance.isLoanPastDue)
    .then(finance.nextPaymentDate)
    .then(finance.outstandingPrincipal)
    .then(finance.paymentAllocations)
    .then(success, failure);

function success(result){
//  console.log(result);
}

function failure(err){
  console.error(err);
}
