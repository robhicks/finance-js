"use strict";

var finance = require('../finance');

describe("PV", function () {
    var PV;
    var PMT = 100;
    var NPER = 10;
    var rate = 10 / 1200;
    var type = 0;
    var expectedResult = 920.3621655947682;
    beforeEach(function (){
        PV = finance.PV;
    });

    describe("Test synchronous interface", function () {
        it("calculates PV in synchronous mode", function () {

            var actualResult = PV(rate, NPER, PMT, type);
            expect(actualResult).toEqual(expectedResult);
        });
    });

    describe("Test Node-Style asynchronous interface", function () {
        it("calculates PV in asynchronous mode and returns in familiar node (err, result) format", function () {

            PV(rate, NPER, PMT, type, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });



});