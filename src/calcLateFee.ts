import loan from "./loan";

export function calcLateFee(loan: loan): number {
  var lateFee = 0;
  if (loan.lateChargeType === "FIXED") {
    lateFee = loan.lateChargeAmount;
  } else {
    lateFee = loan.paymentAmount * loan.lateChargeAmount;
  }

  if (lateFee > loan?.lateChargeMax) lateFee = loan.lateChargeMax;
  if (lateFee < loan?.lateChargeMin) lateFee = loan.lateChargeMin;

  return lateFee;
}
