/*
 paymentAmount
 ---
 calculates the payment for a loan with the following parameters:
 * pv (required) - loan amount
 * nper (required) - the number of periods
 * rate (required) - the rate per period
 * interestOnly (optional) - boolean indicating if the loan is an interest only loan
 */
export function paymentAmount(pv = 0, nper = 0, rate = 0, interestOnly = false) {
  if (interestOnly) return pv * nper * rate / nper;
  return  pv * (rate * Math.pow(1 + rate, nper)) / (Math.pow(1 + rate, nper) - 1);
}
