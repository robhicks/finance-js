const MS_PER_MONTH = 1000 * 60 * 60 * 24 * 30;

// the number of months between the determination date and the first payment date
export function elapsedMonths(
  determinationDate: Date,
  previousDate: Date
): number {
  const utc2 = Date.UTC(
    determinationDate.getFullYear(),
    determinationDate.getMonth(),
    determinationDate.getDate()
  );
  const utc1 = Date.UTC(
    previousDate.getFullYear(),
    previousDate.getMonth(),
    previousDate.getDate()
  );

  return Math.floor((utc2 - utc1) / MS_PER_MONTH);
}
