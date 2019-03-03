import React, { useContext, useState } from 'react';
import { CalendarStoreContext, WEEKDAYS } from './calendar.store';
import Day from './day';
import { ActionModal } from '../action/action-modal';

export default function Calendar() {
  const calStore = useContext(CalendarStoreContext);
  const [actionModalOpen, toggleActionModal] = useState<calendar.Date>(null);

  const headers = WEEKDAYS.map(day => <div key={day}>{day}</div>);
  const days = calStore.calendar.map(day => (
    <Day
      key={day.index}
      day={day}
      addDisabled={false}
      openActionModal={() => toggleActionModal(day)}
    />
  ));

  return (
    <React.Fragment>
      <div className="calendar">
        {headers}
        {days}
      </div>
      <ActionModal open={actionModalOpen} toggleOpen={toggleActionModal} />
    </React.Fragment>
  );
}
