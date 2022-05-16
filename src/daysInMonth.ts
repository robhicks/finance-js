export function daysInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const days = new Date(year, month, 0).getDate();
  return days;
}
