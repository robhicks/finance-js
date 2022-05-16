import { calcLateFee } from "../calcLateFee";

describe("calcLateFee(loan)", () => {
  it("should calculate a fixed late fee", () => {
    const loan = {
      closingDate: new Date("2022-01-01"),
      daysUntilLate: 10,
      firstPaymentDate: new Date("2022-02-01"),
      interestRate: 0.05,
      lateChargeAmount: 20,
      lateChargeMax: 10,
      lateChargeMin: 10,
      lateChargeType: "FIXED",
      loanAmount: 1000,
      paymentAmount: 10,
      transactions: [],
    };

    const fee = calcLateFee(loan);

    expect(fee).to.be.equal(10);
  });

  it("should calculate a percentage late fee", () => {
    const loan = {
      closingDate: new Date("2022-01-01"),
      daysUntilLate: 10,
      firstPaymentDate: new Date("2022-02-01"),
      interestRate: 0.05,
      lateChargeAmount: 0.1,
      lateChargeMax: 100,
      lateChargeMin: 1,
      lateChargeType: "PERCENTAGE",
      loanAmount: 1000,
      paymentAmount: 10,
      transactions: [],
    };

    const fee = calcLateFee(loan);

    expect(fee).to.be.equal(1);
  });

  it("should return a minimum late fee", () => {
    const loan = {
      closingDate: new Date("2022-01-01"),
      daysUntilLate: 10,
      firstPaymentDate: new Date("2022-02-01"),
      interestRate: 0.05,
      lateChargeAmount: 0.1,
      lateChargeMax: 100,
      lateChargeMin: 10,
      lateChargeType: "PERCENTAGE",
      loanAmount: 1000,
      paymentAmount: 10,
      transactions: [],
    };

    const fee = calcLateFee(loan);

    expect(fee).to.be.equal(10);
  });

  it("should return a maximum late fee", () => {
    const loan = {
      closingDate: new Date("2022-01-01"),
      daysUntilLate: 10,
      firstPaymentDate: new Date("2022-02-01"),
      interestRate: 0.05,
      lateChargeAmount: 0.5,
      lateChargeMax: 40,
      lateChargeMin: 10,
      lateChargeType: "PERCENTAGE",
      loanAmount: 1000,
      paymentAmount: 100,
      transactions: [],
    };

    const fee = calcLateFee(loan);

    expect(fee).to.be.equal(40);
  });
});
