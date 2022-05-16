import { expect } from "chai";
import { addDays } from "../addDays";

describe("addDays(date, days)", () => {
  it("should add days that don't cross a month boundary", () => {
    const d = new Date("2022-01-01");
    const days = 5;
    const r = addDays(d, days);
    const y = r.getFullYear();
    const m = r.getMonth();
    const date = r.getDate();
    expect(y).to.be.equal(2022);
    expect(m).to.be.equal(0);
    expect(date).to.be.equal(5);
  });

  it("should add days that cross a month boundary within the same year", () => {
    const d = new Date("2022-01-01");
    const days = 35;
    const r = addDays(d, days);
    const y = r.getFullYear();
    const m = r.getMonth();
    const date = r.getDate();
    expect(y).to.be.equal(2022);
    expect(m).to.be.equal(1);
    expect(date).to.be.equal(4);
  });

  it("should add days that cross a year", () => {
    const d = new Date("2022-01-01");
    const days = 400;
    const r = addDays(d, days);
    const y = r.getFullYear();
    const m = r.getMonth();
    const date = r.getDate();
    expect(y).to.be.equal(2023);
    expect(m).to.be.equal(1);
    expect(date).to.be.equal(4);
  });
});
