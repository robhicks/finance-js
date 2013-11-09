"use strict";

var finance = require('../finance');

describe("PVofPerpetuity", function () {
    var PVofPerpetuity;
    var PMT = 100;
    var rate = 10 / 1200;
    var expectedResult = 12000;        ;
    beforeEach(function (){
        PVofPerpetuity = finance.PVofPerpetuity;
    });

    describe("Test synchronous interface", function () {
        it("calculates interest in synchronous mode", function () {

            var actualResult = PVofPerpetuity(rate, PMT);
            expect(actualResult).toEqual(expectedResult);
        });
    });


    describe("Test Node-Style asynchronous interface", function () {
        it("calculates interest in asynchronous mode and returns in familiar node (err, result) format", function () {

            PVofPerpetuity(rate, PMT, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });

});