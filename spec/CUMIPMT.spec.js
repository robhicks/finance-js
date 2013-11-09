"use strict";

var finance = require('../finance');

describe("CUMIPMT", function () {
    var CUMIPMT;
    var amount = 1000;
    var months = 10;
    var payment = 105;
    var expectedResult = 10.76498031616211;
    beforeEach(function (){
        CUMIPMT = finance.CUMIPMT;
    });

    describe("Test synchronous interface", function () {
        it("calculates interest rate in synchronous mode", function () {

            var actualResult = CUMIPMT(amount, months, payment);

            expect(actualResult).toEqual(expectedResult);
        });
    });

    describe("Test Node-Style asynchronous interface", function () {
        it("calculates interest rate in asynchronous mode and returns in familiar node (err, result) format", function () {

            CUMIPMT(amount, months, payment, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });

});