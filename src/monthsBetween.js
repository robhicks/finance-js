import { daysBetween } from './daysBetween.js';

export function monthsBetween(startDate, endDate) {
  const days = daysBetween(startDate, endDate);
  const months = parseInt(days / 30, 10);
  return Math.abs(months);
}
