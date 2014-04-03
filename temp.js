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
  daysUntilLate: 10,
  transactions: [
    {paymentNumber: 1, receivedDate: new Date(2012, 0, 1), amount: 45.88},
    {paymentNumber: 2, receivedDate: new Date(2012, 1, 1), amount: 45.88},
    {paymentNumber: 3, receivedDate: new Date(2012, 2, 1), amount: 45.88}
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
//    .then(finance.nextPaymentDue)
    .then(success, failure);
//    .then(finance.paymentAmount)
//    .done(function(result){
//      console.log(result);
//    },
//    function(err){
//      console.log(err);
//    });

function success(result){
  console.log(result);
}

function failure(err){
  console.error(err);
}
//console.log("firstPaymentDate", finance.firstPaymentDate(loan));
//console.log("numberOfPayments", finance.numberOfPayments(loan));
//console.log("paymentAmount", finance.paymentAmount(loan));
//console.log("nextPaymentDue", finance.nextPaymentDue(loan));
//console.log("generateAmortizationTable", finance.generateAmortizationTable(loan));