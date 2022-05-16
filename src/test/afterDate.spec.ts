import { expect } from "chai";
import { afterDate } from "../afterDate";

describe("afterDate(date1, date2)", () => {
  it("should show a date after a date in the same month", () => {
    const d1 = new Date("2022-01-01");
    const d2 = new Date("2022-01-02");
    expect(afterDate(d2, d1)).to.be.true;
    expect(afterDate(d1, d2)).to.be.false;
  });
  it("should show a date after a date in the same year", () => {
    const d1 = new Date("2022-01-01");
    const d2 = new Date("2022-12-02");
    expect(afterDate(d2, d1)).to.be.true;
    expect(afterDate(d1, d2)).to.be.false;
  });
  it("should show a date after a date in different years", () => {
    const d1 = new Date("2022-01-01");
    const d2 = new Date("2023-12-02");
    expect(afterDate(d2, d1)).to.be.true;
    expect(afterDate(d1, d2)).to.be.false;
  });
});
