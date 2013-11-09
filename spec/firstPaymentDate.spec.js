"use strict";

var finance = require('../finance');

describe("firstPaymentDate", function () {
    var firstPaymentDate;

    beforeEach(function (){
        firstPaymentDate = finance.firstPaymentDate;
    });

    describe("Test dateFunded argument", function(){
        it('sends the wrong dateFunded type', function(){
            expect(firstPaymentDate("Jan 1, 2013").toEqual(''));
        });
    });

});