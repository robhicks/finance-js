"use strict";

var finance = require('../finance');

describe("isPositiveInteger", function () {
    var func = finance["isPositiveInteger"];

    describe("Test if positive integer", function () {
        it("should return true for a positive integer", function () {
            func(100, function(err, result){
                expect(result).toEqual(true);
            });
        });
    });

    describe("Test if positive integer", function () {
        it("should return false for a negative integer", function () {
            func(-100, function(err, result){
                expect(result).toEqual(false);
            });
        });
    });

    describe("Test if positive integer", function () {
        it("should return false for a number which is not an integer", function () {
            func(3.14, function(err, result){
                expect(result).toEqual(false);
            });
        });
    });

});