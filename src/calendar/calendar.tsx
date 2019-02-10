import React, { useContext } from 'react';
import { CalendarStoreContext, WEEKDAYS } from './calendar.store';
import Day from './day';

export default function Calendar() {
  const calStore = useContext(CalendarStoreContext);
  const headers = WEEKDAYS.map(day => <div key={day}>{day}</div>);
  const days = calStore.calendar.map(day => <Day key={day.index} day={day} addDisabled={false} />);

  return (
    <div className="calendar">
      {headers}
      {days}
    </div>
  );
}
