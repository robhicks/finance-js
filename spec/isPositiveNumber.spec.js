"use strict";

var finance = require('../finance');

describe("isPositiveNumber", function () {
    var func = finance["isPositiveNumber"];
    var positive = 100;
    var negative = -100;

    describe("Test if positive number", function () {
        it("should return true for a positive number", function () {
            func(positive, function(err, result){
                expect(result).toEqual(true);
            });
        });
    });

    describe("Test if positive number", function () {
        it("should return false for a negative number", function () {
            func(negative, function(err, result){
                expect(result).toEqual(false);
            });
        });
    });

});