"use strict";

var finance = require('./finance');

var amount = 1000;
var NPER = 36;
var rate = 10 / 1200;
var PMT = 100;
var type = 0;
var PV = 10000;
var FV = 10000;
//var firstPaymentDate = new Date(2013, 10, 4);
var firstPaymentDate = new Date(2013, 10, 4);
var balloonDate = new Date(2014, 10, 4);
var frequency = 'semimonthly';
var balloonAmount = 500;
var balloonPeriod = 18;

//console.log(finance.PVofLumpSum(rate, NPER, amount));

//console.log(finance.PV(rate, NPER, PMT, type));

//console.log(finance.PVofPerpetuity(rate, PMT));

//console.log(finance.FV(rate, NPER, PMT, type));

//console.log(finance.PMT(PV, NPER, rate, type)); //PV, NPER, rate

//console.log(finance.NPER(rate, PMT, FV, type)); //rate, PMT, PV, FV, type

//console.log(finance.payments(NPER, frequency));

console.log(finance.GenAmortizationSchedule(PV, NPER, 10, firstPaymentDate, frequency, balloonDate, type));

//finance.GenAmortizationSchedule(PV, NPER, 10, firstPaymentDate, frequency, balloonAmount, balloonDate, type);

//console.log(finance.RemainingBalance(PV, rate, NPER, PMT, type));

//console.log(finance.BalloonLoan(PV, rate, NPER, balloonAmount, null, type));
