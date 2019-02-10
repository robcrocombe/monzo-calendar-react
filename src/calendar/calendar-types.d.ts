declare namespace calendar {
  interface Date {
    date: any;
    index: number;
    isToday: boolean;
    isCurrentMonth: boolean;
    isWeekend: boolean;
    isFuture: boolean;
    weekDay: number;
    actions: Transactions;
  }

  interface Transactions {
    past: monzo.Transaction[];
    planned: monzo.Transaction[];
  }
}
