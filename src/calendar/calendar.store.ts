import moment from 'moment';
import { createContext } from 'react';
import { observable, action } from 'mobx';

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

class CalendarStore {
  @observable public startDate: moment.Moment;
  @observable public endDate: moment.Moment;
  @observable public calendar: calendar.Date[];
  @observable public todayIndex: number;
  public offsetMonth: number = 0;
  public readonly now = moment().subtract(this.offsetMonth, 'month');

  constructor() {
    this.init();
  }

  @action
  private init() {
    this.startDate = this.getStartDate();
    this.endDate = this.getEndDate();
    this.calendar = [];

    for (let m = this.startDate.clone(); m.isBefore(this.endDate); m.add(1, 'days')) {
      this.calendar.push(this.newDayObject(m, this.now, this.calendar.length));
    }
  }

  private getStartDate(): moment.Moment {
    const startOfMonth = this.now.clone().startOf('month');
    return startOfMonth.subtract(startOfMonth.isoWeekday() - 1, 'days');
  }

  private getEndDate(): moment.Moment {
    const endOfMonth = this.now.clone().endOf('month');
    return endOfMonth.add(7 - endOfMonth.isoWeekday(), 'days');
  }

  private newDayObject(day: moment.Moment, now: moment.Moment, index: number): calendar.Date {
    const date = day.clone();
    const isToday = date.isSame(now, 'day');

    if (isToday) {
      this.todayIndex = index;
    }

    return {
      date,
      index,
      isToday,
      isCurrentMonth: date.isSame(now, 'month'),
      isWeekend: date.isoWeekday() > 5,
      isFuture: date.isSameOrAfter(now, 'day'),
      weekDay: date.isoWeekday(),
    };
  }
}

export const calendarStore = new CalendarStore();
export const CalendarStoreContext = createContext(calendarStore);
