export function treatAsUTC(date) {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

export function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const adjustedStartDate = treatAsUTC(startDate);
  const adjustedEndDate = treatAsUTC(endDate);
  const diff = adjustedEndDate - adjustedStartDate;
  const days = diff / millisecondsPerDay;
  return Math.abs(days);
}
