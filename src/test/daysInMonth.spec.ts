import { daysInMonth } from "../daysInMonth";

describe("daysInMonth()", () => {
  it("return the number of days of January 2020", () => {
    const date = new Date("January 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it("return the number of days of February 2019", () => {
    const date = new Date("February 1, 2019");
    const d = daysInMonth(date);
    expect(d).to.equal(28);
  });
  it("return the number of days of February 2020", () => {
    const date = new Date("February 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(29);
  });
  it("return the number of days of March 2020", () => {
    const date = new Date("March 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it("return the number of days of April 2020", () => {
    const date = new Date("April 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it("return the number of days of May 2020", () => {
    const date = new Date("May 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it("return the number of days of June 2020", () => {
    const date = new Date("June 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it("return the number of days of July 2020", () => {
    const date = new Date("July 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it("return the number of days of August 2020", () => {
    const date = new Date("August 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it("return the number of days of September 2020", () => {
    const date = new Date("September 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it("return the number of days of October 2020", () => {
    const date = new Date("October 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
  it("return the number of days of November 2020", () => {
    const date = new Date("November 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(30);
  });
  it("return the number of days of December 2020", () => {
    const date = new Date("December 1, 2020");
    const d = daysInMonth(date);
    expect(d).to.equal(31);
  });
});
