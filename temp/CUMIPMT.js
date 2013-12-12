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

    describe("Test with all parameters", function () {
        it("calculates calculates cumulative interest using PV:1000, NPER:10: ", function () {

            CUMIPMT(amount, months, payment, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });

});