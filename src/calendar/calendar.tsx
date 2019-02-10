import React, { useState } from 'react';
import * as calService from './calendar.service';
import Day from './day';

export default function Calendar() {
  const headers = calService.WEEKDAYS.map(day => <div key={day}>{day}</div>);
  const days = calService.calendar.map(day => (
    <Day key={day.index} day={day} addDisabled={false} />
  ));

  return (
    <div className="calendar">
      {headers}
      {days}
    </div>
  );
}
