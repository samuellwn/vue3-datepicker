import {
  isBefore,
  isAfter,
  startOfMonth,
  endOfMonth,
  getDay
} from 'date-fns';

const isEnabled = (
  target: Date,
  lower: Date | undefined,
  upper: Date | undefined,
  weekdays: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> | undefined,
): boolean => {
  if (!lower && !upper && !weekdays) return true
  if (lower && isBefore(target, startOfMonth(lower))) return false
  if (upper && isAfter(target, endOfMonth(upper))) return false
  if (weekdays && !weekdays.includes(getDay(target))) return false
  return true
}

export {
  isEnabled
}