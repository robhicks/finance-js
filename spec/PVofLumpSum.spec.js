"use strict";

var finance = require('../finance');

describe("PVofLumpSum", function () {
    var PVofLumpSum;
    var FV = 1000;
    var NPER = 10;
    var rate = 10 / 1200;
    var expectedResult = 920.3621655947682;        ;
    beforeEach(function (){
        PVofLumpSum = finance.PVofLumpSum;
    });

    describe("Test synchronous interface", function () {
        it("calculates interest in synchronous mode", function () {

            var actualResult = PVofLumpSum(rate, NPER, FV);
            expect(actualResult).toEqual(expectedResult);
        });
    });


    describe("Test Node-Style asynchronous interface", function () {
        it("calculates interest in asynchronous mode and returns in familiar node (err, result) format", function () {

            PVofLumpSum(rate, NPER, FV, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });

});