"use strict";

var finance = require('./finance');

var amount = 5000;
var NPER = 12;
var rate = 7.99 / 1200;
var PMT = 100;
var type = 0;
var PV = amount;
var FV = amount;
var firstPaymentDate = new Date(2012, 0, 1);
var originationDate = new Date(2011, 10, 4);
var balloonDate = new Date(2014, 10, 4);
var frequency = 'monthly';
var balloonAmount = 500;
var balloonPeriod = 18;

var loan = {
   pastDue: finance.IsLoanPastDue({
         InitialLoanAmount: amount,
         OriginationDate: originationDate,
         InterestPrepaymentAmount: 0,
         FirstPaymentDate: firstPaymentDate,
         Term: NPER,
         Frequency: frequency,
         Rate: 4,
         DeterminationDate: new Date(),
         GraceDays: 10,
         transactions: []
      }),
   firstPaymentDate: finance.FirstPaymentDate(originationDate),
   amortizationTable: finance.GenAmortizationSchedule(PV, NPER, 7.99, firstPaymentDate, frequency)
};

//console.log(finance.PVofLumpSum(rate, NPER, FV));

//console.log(finance.PV(rate, NPER, PMT, type));

//console.log(finance.PVofPerpetuity(rate, PMT));

//console.log(finance.CumulativeInterestPaid(rate, NPER, PV, 3, 6, 0));

//console.log(finance.FV(rate, NPER, PMT, type));

//console.log(finance.PMT(PV, NPER, rate, type));

//console.log(finance.NPER(rate, PMT, FV, type)); rate, PMT, PV, FV, type

//console.log(finance.Payments(NPER, frequency));

//console.log(finance.GenAmortizationSchedule(PV, NPER, 7.99, firstPaymentDate, frequency));

//console.log(finance.RemainingBalance(PV, rate, NPER, PMT, type));

//console.log(finance.BalloonLoan(PV, rate, NPER, balloonAmount, null, type));

//console.log(finance.FirstPaymentDate(originationDate));

/*
console.log(finance.EarnedAmount({
   InitialLoanAmount: amount,
   OriginationDate: originationDate,
   InterestPrepaymentAmount: 0,
   FirstPaymentDate: firstPaymentDate,
   Term: NPER,
   Frequency: frequency,
   Rate: 4,
   DeterminationDate: new Date()
}));
*/

/*
console.log(finance.IsLoanPastDue({
   InitialLoanAmount: amount,
   OriginationDate: originationDate,
   InterestPrepaymentAmount: 0,
   FirstPaymentDate: firstPaymentDate,
   Term: NPER,
   Frequency: frequency,
   Rate: 4,
   DeterminationDate: new Date(),
   GraceDays: 10,
   transactions: []
}));
*/

console.log(finance.NextPaymentDate(loan));