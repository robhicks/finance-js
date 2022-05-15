import { paymentAmount } from "../paymentAmount";

describe("paymentAmount()", () => {
  it("should return NaN if no parameters are provided", () => {
    const a = paymentAmount();
    expect(a).to.be.NaN;
  });
  it("should return the proper payment for a pv of 1000, nper 12 and rate of 10% per annum", () => {
    const rate = 10 / 100 / 12;
    const a = paymentAmount(1000, 12, rate);
    expect(a).to.equal(87.91588723000989);
  });
  it("should return the interest only payment for a pv of 1000, nper 12 and rate of 10% per annum", () => {
    const rate = 10 / 100 / 12;
    const a = paymentAmount(1000, 12, rate, true);
    expect(a).to.equal(8.333333333333334);
  });
});
