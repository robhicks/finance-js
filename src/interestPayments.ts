export function interestPayments(rate = 0, nper = 0, pv = 0, type = 0) {
  return type === 1
    ? (pv * (Math.pow(1 + rate, nper) - 1)) * (1 + rate)
    : pv * (Math.pow(1 + rate, nper) - 1);
}
