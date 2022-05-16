import { expect } from "chai";
import { monthsBetween } from "../monthsBetween";

describe("monthsBetween()", () => {
  it("should return 0 if the dates are the same", () => {
    const startDate = new Date();
    const endDate = new Date();
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(0);
  });
  it("should return 1 if the dates differ by a month", () => {
    const startDate = new Date("December 31, 2019");
    const endDate = new Date("January 31, 2020");
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(1);
  });
  it("should return 1 if the dates differ by a month and a half", () => {
    const startDate = new Date("December 31, 2019");
    const endDate = new Date("February 15, 2020");
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(1);
  });
  it("should return 1 if the dates differ by a month, even if the start date and end date are reversed", () => {
    const startDate = new Date("December 31, 2019");
    const endDate = new Date("January 31, 2020");
    const mb = monthsBetween(endDate, startDate);
    expect(mb).to.equal(1);
  });
  it("should return 12 if the dates differ by a year", () => {
    const startDate = new Date("December 31, 2020");
    const endDate = new Date("December 31, 2021");
    const mb = monthsBetween(startDate, endDate);
    expect(mb).to.equal(12);
  });
});
