/*
 firstPaymentDate
 ----------------
 This function calculates the first payment date of a loan. It defaults to
 the first day of the month which is at least one full month from the date
 the loan was funded (origination or funding date).

 This function takes the following arguments:
 * closingDate (required) - the funding or origination date of the loan
 * firstPaymentDay (optional) - desired day of the month for the payment - defaults to the first day
 */
export function firstPaymentDate(closingDate = new Date(), firstPaymentDay = 1) {
  const oneMonthOut = new Date(closingDate.setMonth(closingDate.getMonth() + 1));
  const twoMonthsOut = new Date(closingDate.setMonth(closingDate.getMonth() + 2));
  const oneMonthOutDate = new Date(oneMonthOut.setDate(firstPaymentDay));
  const twoMonthsOutDate = new Date(twoMonthsOut.setDate(firstPaymentDay));
  console.log('twoMonthsOutDate.toDateString()', twoMonthsOutDate.toDateString());
  return closingDate.getDate() > 1 ? closingDate.setMonth(closingDate.getMonth() + 2) : closingDate.setMonth(closingDate.getMonth() + 1);
}
