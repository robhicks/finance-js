/*
 presentValueOfLumpSum
 -----------
 Calculates the present value of a lump sum received in the future. Params include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of periods
 * FV (required) - the future value or lump sum to be received
 */
export function presentValueOfLumpSum(FV = 0, NPER = 0, rate = 0) {
  return FV / Math.pow(1 + rate, NPER);
}
