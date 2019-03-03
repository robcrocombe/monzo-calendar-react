import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { WEEKDAYS, CalendarStoreContext } from '../calendar/calendar.store';

export default function DatePicker() {
  const calStore = useContext(CalendarStoreContext);
  const [selected, setSelected] = useState<calendar.Date[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const text = selected
      .map(d => d.date.date())
      .sort((a, b) => a - b)
      .join(', ');
    setInputText(text);
  }, [selected]);

  function selectDate(day: calendar.Date) {
    if (selected.indexOf(day) === -1) {
      setSelected([...selected, day]);
    } else {
      setSelected(selected.filter(d => d !== day));
    }
  }

  function inputChanged(e: React.FocusEvent<HTMLInputElement>) {
    const text = e.currentTarget.value;
    const endIndex = calStore.now
      .clone()
      .endOf('month')
      .date();
    const dates = text
      .split(', ')
      .map(num => parseInt(num, 10))
      .filter(num => num && num > 0 && num <= endIndex);

    setSelected(
      calStore.calendar.filter(
        d => d.date.isSame(calStore.now, 'month') && dates.indexOf(d.date.date()) !== -1
      )
    );
  }

  const headers = WEEKDAYS.map(day => (
    <div key={day} className="dp-header" title={day}>
      {day.charAt(0)}
    </div>
  ));
  const days = calStore.calendar.map(day => (
    <div key={day.index}>
      <div
        className={classNames('dp-date', {
          selected: selected.indexOf(day) > -1,
          muted: !day.isCurrentMonth,
        })}
        onClick={() => selectDate(day)}
      >
        {day.date.format('D')}
      </div>
    </div>
  ));

  return (
    <div className="date-picker">
      <input
        type="text"
        placeholder="1, 2, 31, ..."
        className="input truncate"
        style={{ width: '274px' }}
        value={inputText}
        onChange={e => setInputText(e.currentTarget.value)}
        onBlur={inputChanged}
      />
      <div className="dp-container">
        <div className="dp-calendar">
          {headers}
          {days}
        </div>
      </div>
    </div>
  );
}
