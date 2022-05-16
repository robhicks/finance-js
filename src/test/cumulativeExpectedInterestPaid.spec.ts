import { expect } from "chai";

import { cumulativeExpectedInterestPaid } from "../cumulativeExpectedInterestPaid";

describe("cumulativeExpectedInterestPaid()", () => {
  it("should return 0 if no parameters are supplied", () => {
    const cip = cumulativeExpectedInterestPaid();
    expect(cip).to.equal(0);
  });
  it("should return 0 if no parameters are supplied", () => {
    const amount = 1000;
    const rate = 10 / 100 / 12;
    const periods = 12;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods);
    expect(cip).to.equal(96.37973410796363);
  });

  it("should return 0 if no parameters are supplied", () => {
    const amount = 1000;
    const rate = 10 / 100 / 12;
    const periods = 12;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods);
    expect(cip).to.equal(96.37973410796363);
  });
  it("should return 0 if no parameters are supplied", () => {
    const amount = 1000;
    const rate = 10 / 100 / 12;
    const periods = 12;
    const start = 6;
    const cip = cumulativeExpectedInterestPaid(amount, rate, periods, start);
    expect(cip).to.equal(53.659754121131876);
  });
  it("should return 0 if no parameters are supplied", () => {
    const amount = 1000;
    const rate = 10 / 100 / 12;
    const periods = 12;
    const start = 6;
    const end = 8;
    const cip = cumulativeExpectedInterestPaid(
      amount,
      rate,
      periods,
      start,
      end
    );
    expect(cip).to.equal(17.59054503542771);
  });
});
