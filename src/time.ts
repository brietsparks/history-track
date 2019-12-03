import { Timeline, Timespan } from './interfaces';

export function timespansOverlap(a: Timespan, b: Timespan) {
  let { startDate: startA, endDate: endA } = a;
  let { startDate: startB, endDate: endB } = b;

  if ((endA && endA <= startA) || (endB && endB <= startB)) {
    throw new RangeError("startDate must be before endDate");
  }

  if (!endA) {
    return (endB && endB > startA);
  }

  if (!endB) {
    return (endA && endA > startB);
  }

  return !(
    ((endA < endB) && (endA < startB) && (startA < startB)) ||
    ((endB < endA) && (endB < startA) && (startB < startA))
  );
}

export function timelinesOverlap<T extends Timespan>(a: Timeline<T>, b: Timeline<T>) {
  for (let timespanA of a.timespans) {
    for (let timespanB of b.timespans) {
      if (timespansOverlap(timespanA, timespanB)) {
        return true;
      }
    }
  }

  return false;
}

export function getBounds<T extends Timespan>(timelines: Timeline<T>[]) {
  const startTimestamps = [];
  const endTimestamps = [];
  let hasUndefinedEnd;

  for (let timeline of timelines) {
    for (let timespan of timeline.timespans) {
      const { startDate, endDate } = timespan;

      startTimestamps.push(startDate.getTime());

      if (!hasUndefinedEnd) {
        if (endDate) {
          endTimestamps.push(endDate.getTime())
        } else {
          hasUndefinedEnd = true;
        }
      }
    }
  }

  const startDate = new Date(Math.min(...startTimestamps));
  const endDate = hasUndefinedEnd ? new Date() : new Date(Math.max(...endTimestamps));

  return [startDate, endDate];
}

export function monthDiff(d1: Date, d2: Date) {
  let months;
  months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months -= d2.getMonth() + 1;
  months += d1.getMonth();
  return months <= 0 ? 0 : months;
}
