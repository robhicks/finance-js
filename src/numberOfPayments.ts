/*
 numberOfPayments
 --------
 Calculates the number of payments for a loan. This is different than NPER.
 NPER calculates the number of periods used in an annuity or loan from
 a financial perspective. This function looks at how frequently a customer
 chooses to make payments. This function has the following arguments:
 * term: the number of periods used in calculating interest for a loan
 * frequency: the payment frequency, which can be any of the following:
 - semimonthly - twice a month
 - monthly - once each month
 - bimonthly - every two months
 - quarterly - every quarter
 - semiannually - ever 6 months
 - annually - ever 12 months
 - none or one - only one payment at the end of the loan - typically don't mix this with balloonDate
 */
export function numberOfPayments(term = 0, frequency = 'monthly') {
  const freq = frequency.toLowerCase();
  let payments;
  if (freq === 'semimonthly') {
    (payments = parseInt(term * 2));
  } else if (freq === 'bimonthly') {
    payments = (parseInt(term / 2));
  } else if (freq === 'quarterly') {
    payments = (parseInt(term / 4));
  } else if (freq === 'semiannually') {
    payments = (parseInt(term / 6));
  } else if (freq === 'annually') {
    payments = (parseInt(term / 12));
  } else if (freq === 'none' || freq === 'one') {
    payments = 1;
  } else {
    payments = term;
  }
  return payments;
}
