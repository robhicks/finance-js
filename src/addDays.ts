export function addDays(date: date, days: number): date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
