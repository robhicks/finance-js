export function addMonths(date: date, months: number): date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
