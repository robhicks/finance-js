"use strict";

var finance = require('../finance');

describe("isFunction", function () {
    var func = "isFunction";
    var expectedResult = true;
    beforeEach(function (){
        func = finance[func];
    });

    describe("Test if function", function () {
        it("should return true for a function", function () {
            var thing = function(){};

            func(thing, function(err, result){
                expect(result).toEqual(expectedResult);
            });
        });
    });

});