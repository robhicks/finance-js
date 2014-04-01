"use strict";

var finance = require('./finance');

var amount = 5000;
var NPER = 12;
var rate = 7.99 / 1200;
var PMT = 100;
var type = 0;
var PV = amount;
var FV = amount;
var closingDate = new Date(2011, 9, 4);
var balloonDate = new Date(2014, 10, 4);
var frequency = 'monthly';
var balloonAmount = 500;
var balloonPeriod = 18;

var loan = {
  loanAmount: amount,
  closingDate: closingDate,
  prepaidInterest: 0,
  term: NPER,
  frequency: frequency,
  interestRate: 4,
  determinationDate: new Date(),
  graceDays: 10
};

console.log("firstPaymentDate", finance.firstPaymentDate(loan));
console.log("numberOfPayments", finance.numberOfPayments(loan));
console.log("paymentAmount", finance.paymentAmount(loan));
console.log("generateAmortizationTable", finance.generateAmortizationTable(loan));