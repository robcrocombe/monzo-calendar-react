import moment from 'moment';

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

let startDate: moment.Moment;
let endDate: moment.Moment;
let offsetMonth: number = 0;
export let calendar: calendar.Date[] = [];
export let todayIndex: number;

const now = moment();

startDate = getStartDate(now);
endDate = getEndDate(now);

for (let m = startDate.clone(); m.isBefore(endDate); m.add(1, 'days')) {
  calendar.push(getDayObject(m, now, calendar.length));
}

export function getStartDate(now: moment.Moment): moment.Moment {
  if (!now) return startDate;

  const startOfMonth = now.clone().startOf('month');
  return startOfMonth
    .subtract(offsetMonth, 'month')
    .subtract(startOfMonth.isoWeekday() - 1, 'days');
}

export function getEndDate(now: moment.Moment): moment.Moment {
  if (!now) return endDate;

  const endOfMonth = now.clone().endOf('month');
  return endOfMonth.subtract(offsetMonth, 'month').add(7 - endOfMonth.isoWeekday(), 'days');
}

function getDayObject(day: moment.Moment, now: moment.Moment, index: number): calendar.Date {
  const date = day.clone();
  const isToday = date.isSame(now, 'day');

  if (isToday) {
    todayIndex = index;
  }

  return {
    date,
    index,
    isToday,
    isCurrentMonth: date.isSame(now, 'month'),
    isWeekend: date.isoWeekday() > 5,
    isFuture: date.isSameOrAfter(now, 'day'),
    weekDay: date.isoWeekday(),
    actions: {
      past: [],
      planned: [],
    },
  };
}
