import { expect } from "chai";
import { getLoanBalance } from "../getLoanBalance";

describe("getLoanBalance(loan, determinationDate)", () => {
  it("should be the original loan amount if payments have not been made", () => {
    const loan = {
      closingDate: new Date("2022-01-01"),
      daysUntilLate: 10,
      firstPaymentDate: new Date("2022-02-01"),
      interestRate: 0.05,
      lateChargeAmount: 0.1,
      lateChargeMax: 200,
      lateChargeMin: 1,
      lateChargeType: "FIXED",
      loanAmount: 10000,
      paymentAmount: 10,
      transactions: [],
    };

    const dd = new Date("2022-05-15");

    const lb = getLoanBalance(loan, dd);
    expect(lb).to.be.equal(10000);
  });

  it("should be calculated when payments have been made", () => {
    const loan = {
      closingDate: new Date("2022-01-01"),
      daysUntilLate: 10,
      firstPaymentDate: new Date("2022-02-01"),
      interestRate: 0.05,
      lateChargeAmount: 0.1,
      lateChargeMax: 200,
      lateChargeMin: 1,
      lateChargeType: "FIXED",
      loanAmount: 10000,
      paymentAmount: 10,
      transactions: [
        {
          amount: 100,
          principal: 90,
          type: "LOAN_PAYMENT",
          txDate: new Date("2022-02-01"),
        },
        {
          amount: 100,
          principal: 90,
          type: "LOAN_PAYMENT",
          txDate: new Date("2022-03-01"),
        },
      ],
    };

    const dd = new Date("2022-05-15");

    const lb = getLoanBalance(loan, dd);
    expect(lb).to.be.equal(9820);
  });
});
