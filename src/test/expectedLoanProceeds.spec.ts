import { expectedLoanProceeds } from "../expectedLoanProceeds";

describe("expectedLoanProceeds()", () => {
  it("description", () => {
    const props = {
      amount: 1000,
      rate: 10,
      term: 12,
      payments: 12,
      payment: 100,
    };
    const e = expectedLoanProceeds(props);
    expect(e).to.equal(96.37973410796371);
  });
});
