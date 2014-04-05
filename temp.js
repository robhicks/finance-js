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
    {paymentNumber: 1, receivedDate: new Date(2012, 0, 1), amount: 92.08, principal: 25.66},
    {paymentNumber: 2, receivedDate: new Date(2012, 1, 1), amount: 92.08, principal: 25.66},
    {paymentNumber: 3, receivedDate: new Date(2012, 2, 1), amount: 92.08, principal: 25.66}
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
    .then(finance.aggregateLateFees)
    .then(finance.interestAllocationForPayment)
    .then(success, failure);

function success(result){
//  console.log(result);
}

function failure(err){
  //console.error(err);
}
