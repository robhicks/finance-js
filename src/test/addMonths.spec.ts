import { expect } from "chai";
import { addMonths } from "../addMonths";

describe("addMonths()", () => {
  it("should add a single month to a date at the end of a year", () => {
    const date = new Date("December 17, 1977");
    const monthLater = addMonths(date, 1);
    expect(monthLater.getFullYear()).to.equal(1978);
    expect(monthLater.getMonth()).to.equal(0);
    expect(monthLater.getDate()).to.equal(17);
  });
  it("should add 14 months to a date at the beginning of a year", () => {
    const date = new Date("January 1, 1977");
    const d = addMonths(date, 14);
    expect(d.getFullYear()).to.equal(1978);
    expect(d.getMonth()).to.equal(2);
    expect(d.getDate()).to.equal(1);
  });
  it("should work for large periods", () => {
    const date = new Date("January 1, 1977");
    const d = addMonths(date, 120);
    expect(d.getFullYear()).to.equal(1987);
    expect(d.getMonth()).to.equal(0);
    expect(d.getDate()).to.equal(1);
  });
});
