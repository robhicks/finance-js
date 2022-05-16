import { expect } from "chai";
import { firstPaymentDate } from "../firstPaymentDate";

describe("firstPaymentDate()", () => {
  it("should return January 1, 2020", () => {
    const firstPaymentDay = 1;
    const closingDate = new Date("November 14, 2019 03:24:00");
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain("Jan");
    expect(d).to.contain("1");
    expect(d).to.contain("2020");
  });
  it("should return December 1, 2019", () => {
    const firstPaymentDay = 1;
    const closingDate = new Date("November 1, 2019 03:24:00");
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain("Dec");
    expect(d).to.contain("1");
    expect(d).to.contain("2019");
  });
  it("should return January 1, 2020", () => {
    const firstPaymentDay = 1;
    const closingDate = new Date("November 30, 2019 03:24:00");
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain("Jan");
    expect(d).to.contain("1");
    expect(d).to.contain("2020");
  });
  it("should return February 1, 2020", () => {
    const firstPaymentDay = 1;
    const closingDate = new Date("December 31, 2019 03:24:00");
    const d = firstPaymentDate(closingDate, firstPaymentDay).toDateString();
    expect(d).to.contain("Feb");
    expect(d).to.contain("1");
    expect(d).to.contain("2020");
  });
});
