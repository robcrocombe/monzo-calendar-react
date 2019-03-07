declare namespace calendar {
  interface Date {
    date: any;
    index: number;
    isToday: boolean;
    isCurrentMonth: boolean;
    isWeekend: boolean;
    isFuture: boolean;
    weekDay: number;
  }
}
