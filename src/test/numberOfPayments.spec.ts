import { numberOfPayments } from "../numberOfPayments";

describe("numberOfPayments()", () => {
  it("should return 0 if no parameters are provided", () => {
    const payments = numberOfPayments();
    expect(payments).to.equal(0);
  });
  it("should return 12 if the term is twelve and the frequency is monthly", () => {
    const p = numberOfPayments(12);
    expect(p).to.equal(12);
  });
  it("should return 24 if the term is twelve and the frequency is semimonthly", () => {
    const p = numberOfPayments(12, "semimonthly");
    expect(p).to.equal(24);
  });
  it("should return 6 if the term is twelve and the frequency is bimonthly", () => {
    const p = numberOfPayments(12, "bimonthly");
    expect(p).to.equal(6);
  });
  it("should return 3 if the term is twelve and the frequency is quarterly", () => {
    const p = numberOfPayments(12, "quarterly");
    expect(p).to.equal(3);
  });
  it("should return 2 if the term is twelve and the frequency is semiannually", () => {
    const p = numberOfPayments(12, "semiannually");
    expect(p).to.equal(2);
  });
  it("should return 1 if the term is twelve and the frequency is annually", () => {
    const p = numberOfPayments(12, "annually");
    expect(p).to.equal(1);
  });
  it("should return 1 if the term is twelve and the frequency is none or one", () => {
    const p = numberOfPayments(12, "none");
    expect(p).to.equal(1);
    const p1 = numberOfPayments(12, "one");
    expect(p1).to.equal(1);
  });
});
