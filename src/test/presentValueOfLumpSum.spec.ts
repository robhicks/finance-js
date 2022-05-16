import { expect } from "chai";
import { presentValueOfLumpSum } from "../presentValueOfLumpSum";

describe("presentValueOfLumpSum()", () => {
  it("should return 0 if no parameters are provided", () => {
    const pv = presentValueOfLumpSum();
    expect(pv).to.equal(0);
  });
  it("should return the present value of $10000 received 60 periods in the future with a rate of .001", () => {
    const pv = presentValueOfLumpSum(10000, 60, 0.001);
    expect(pv).to.equal(9417.927681223207);
  });
});
