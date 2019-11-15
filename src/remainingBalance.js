import { presentValueOfAnnuity } from './presentValueOfAnnuity.js';

export function remainingBalance({ originalAmount = 0, payment = 0, rate = 0, payments = 0 } = {}) {
  const fvOfOrig = originalAmount * Math.pow(1 + rate, payments);
  const fvOfAnn = presentValueOfAnnuity({ payment, rate, payments });
  return fvOfOrig - fvOfAnn;
}
