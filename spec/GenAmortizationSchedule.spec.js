"use strict";

var finance = require('../finance');

describe("GenAmortizationSchedule", function () {
    var GenAmortizationSchedule;
    var amount = 1000;
    var months = 10;
    var rate = 10;
    var startDate = new Date();
    var expectedResult = 10;

    beforeEach(function (){
        GenAmortizationSchedule = finance.GenAmortizationSchedule;
    });

    describe("Test synchronous interface", function () {
        it("generates amortization schedule in synchronous mode", function () {

            var actualResult = GenAmortizationSchedule(amount, months, rate, startDate);

            expect(actualResult).toEqual(actualResult);
        });
    });

    describe("Test Node-Style asynchronous interface", function () {
        it("generates amortization schedule in asynchronous mode and returns in familiar node (err, result) format", function () {

            GenAmortizationSchedule(amount, months, rate, startDate, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });

});