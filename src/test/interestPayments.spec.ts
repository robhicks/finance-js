import { expect } from "chai";
import { interestPayments } from "../interestPayments";

describe("interestPayments()", () => {
  it("should return 0 if no payments have been made", () => {
    const ip = interestPayments();
    expect(ip).to.equal(0);
  });
  it("should return the interest payments made at the end of each period", () => {
    const rate = 10 / 100 / 12;
    const periods = 12;
    const amount = 1000;
    const ip = interestPayments(rate, periods, amount);
    expect(ip).to.equal(104.71306744129683);
  });

  it("should return the interest payments made at the beginning of each period", () => {
    const rate = 10 / 100 / 12;
    const periods = 12;
    const amount = 1000;
    const ip = interestPayments(rate, periods, amount, 1);
    expect(ip).to.equal(105.58567633664097);
  });
});
