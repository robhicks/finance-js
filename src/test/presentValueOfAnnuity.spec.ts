import { presentValueOfAnnuity } from "../presentValueOfAnnuity";

describe("presentValueOfAnnuity()", () => {
  it("should return a discounted value", () => {
    const payment = 1;
    const rate = 10 / 100 / 12;
    const payments = 12;
    const pv = presentValueOfAnnuity({ payment, rate, payments });
    expect(pv).to.equal(11.374508425124015);
  });
});
