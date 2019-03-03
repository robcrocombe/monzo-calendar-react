import React, { useContext, useState, useEffect } from 'react';
import classNames from 'classnames';
import { WEEKDAYS, CalendarStoreContext } from '../calendar/calendar.store';

interface Props {
  initialDates: calendar.Date[];
  selectionChanged: (dates: calendar.Date[]) => void;
}

export default function DatePicker(props: Props) {
  const calStore = useContext(CalendarStoreContext);
  const [selected, setSelected] = useState<calendar.Date[]>(props.initialDates);
  const [inputText, setInputText] = useState('');
  const [lastSelected, setLastSelected] = useState<calendar.Date>(null);

  useEffect(() => {
    const text = selected
      .map(d => d.date.date())
      .sort((a, b) => a - b)
      .join(', ');
    setInputText(text);

    props.selectionChanged(selected);
  }, [selected]);

  function selectDate(e: React.MouseEvent, day: calendar.Date) {
    if (e.shiftKey && lastSelected && lastSelected !== day) {
      // Select multiple between two dates if click then shift+click
      const index1 = calStore.calendar.indexOf(lastSelected);
      const index2 = calStore.calendar.indexOf(day);
      const [fromIndex, toIndex] = index1 < index2 ? [index1, index2] : [index2, index1];

      setSelected(
        calStore.calendar.filter(
          (d, i) =>
            d.date.isSame(calStore.now, 'month') &&
            ((i >= fromIndex && i <= toIndex) || selected.indexOf(d) !== -1)
        )
      );
    } else if (selected.indexOf(day) === -1) {
      setLastSelected(day);
      setSelected([...selected, day]);
    } else {
      setLastSelected(null);
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
        onClick={e => selectDate(e, day)}
      >
        {day.date.format('D')}
      </div>
    </div>
  ));

  return (
    <div className="date-picker">
      <input
        type="search"
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
