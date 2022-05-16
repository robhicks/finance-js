import { expect } from "chai";
import { elapsedMonths } from "../elapsedMonths";

describe("elapsedMonths(determinationDate, previousDate)", () => {
  it("should", () => {
    const loanCreationDate = new Date("2017-01-01");
    const determinationDate = new Date("2022-05-15");
    const e = elapsedMonths(determinationDate, loanCreationDate);
    console.log(`e`, e);
  });
});
