export function presentValueOfAnnuity({ payment = 0, rate = 0, payments = 0 } = {}) {
  return payment * ((1 - Math.pow(1 + rate, -payments)) / rate);
}
