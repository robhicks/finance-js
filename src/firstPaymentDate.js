import { daysBetween } from './daysBetween.js';
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
  const cd = closingDate.getDate();
  const om = new Date(closingDate);
  om.setMonth(om.getMonth() + 1);
  om.setDate(firstPaymentDay);
  if (cd > 1) {
    if (daysBetween(closingDate, om) > 30) return om;
    else {
      om.setMonth(om.getMonth() + 1);
      return om;
    }
  }
  return om;

}
