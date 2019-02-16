import moment from 'moment';
import { createContext } from 'react';
import { observable, computed, action } from 'mobx';

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
  private readonly now = moment();

  constructor() {
    this.init();
  }

  @action
  public setPastActions(actions: monzo.Transaction[]) {
    if (!actions.length) return;

    let offset = 0;

    for (let i = 0; i < actions.length; ++i) {
      offset = this.findDayIndex(actions[i].created, offset);

      const day = this.calendar[offset];
      day.actions.past.push(actions[i]);

      this.calendar[offset] = { ...day };
    }
  }

  @action
  public setPlannedActions(actions: monzo.Transaction[]) {
    if (!actions.length) return;

    const keys = Object.keys(actions);

    for (let i = 0; i < keys.length; ++i) {
      const date = parseInt(keys[i]);
      this.calendar[date].actions.planned = actions[keys[i]];
    }
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

  private findDayIndex(date: moment.MomentInput, offset: number): number {
    const momentDate = moment(date);

    for (let i = offset; i < this.calendar.length; ++i) {
      if (this.calendar[i].date.isSame(momentDate, 'day')) {
        return i;
      }
    }
    return 0;
  }

  private getStartDate(): moment.Moment {
    const startOfMonth = this.now.clone().startOf('month');
    return startOfMonth
      .subtract(this.offsetMonth, 'month')
      .subtract(startOfMonth.isoWeekday() - 1, 'days');
  }

  private getEndDate(): moment.Moment {
    const endOfMonth = this.now.clone().endOf('month');
    return endOfMonth.subtract(this.offsetMonth, 'month').add(7 - endOfMonth.isoWeekday(), 'days');
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
      actions: {
        past: [],
        planned: [],
      },
    };
  }
}

export const calendarStore = new CalendarStore();
export const CalendarStoreContext = createContext(calendarStore);
