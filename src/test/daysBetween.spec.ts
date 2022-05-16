import { expect } from "chai";
import { daysBetween, treatAsUTC } from "../daysBetween";

describe("daysBetween()", () => {
  describe("treatAsUTC()", () => {
    it("should adjust date for timezone", () => {
      const date = new Date("January 1, 2019");
      const r = treatAsUTC(date).toDateString();
      expect(r).to.contain("Dec");
      expect(r).to.contain("31");
      expect(r).to.contain("2018");
    });
    it("should adjust another date for timezone", () => {
      const date = new Date("January 2, 2019");
      const r = treatAsUTC(date).toDateString();
      expect(r).to.contain("Jan");
      expect(r).to.contain("01");
      expect(r).to.contain("2019");
    });
  });

  describe("daysBetween()", () => {
    it("should return 0 if the dates are the same", () => {
      const startDate = new Date();
      const endDate = new Date();
      const db = daysBetween(startDate, endDate);
      expect(db).to.equal(0);
    });
    it("should return 1 if the dates differ by a day", () => {
      const startDate = new Date("December 31, 2019");
      const endDate = new Date("January 1, 2020");
      const db = daysBetween(startDate, endDate);
      expect(db).to.equal(1);
    });
    it("should return 1 if the dates differ by a day, even if the start day and end days are reversed", () => {
      const startDate = new Date("December 31, 2019");
      const endDate = new Date("January 1, 2020");
      const db = daysBetween(endDate, startDate);
      expect(db).to.equal(1);
    });
    it("should return 31 if the dates differ by a month", () => {
      const startDate = new Date("December 31, 2019");
      const endDate = new Date("January 31, 2020");
      const db = daysBetween(startDate, endDate);
      expect(db).to.equal(31);
    });
  });
});
