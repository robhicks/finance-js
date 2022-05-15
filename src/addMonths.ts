export default function addMonths(date = new Date(), months = 0) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
