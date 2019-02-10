import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import PastAction from './past-action';

interface Props {
  day: calendar.Date;
  addDisabled: boolean;
}

const Day = observer((props: Props) => {
  // <past-action v-for="t in day.actions.past" :data="t"></past-action>
  // <planned-action v-for="t in day.actions.planned" :data="t"></planned-action>

  function newAction() {}

  function title() {
    if (props.day.date.date() === 1) {
      return props.day.date.format('D MMM');
    }
    return props.day.date.format('D');
  }

  let addActionBtn: React.ReactElement<any>;

  if (props.day.isFuture) {
    addActionBtn = (
      <button
        onClick={newAction}
        disabled={props.addDisabled}
        type="button"
        title="Plan a transaction"
        className="button is-white is-small add-action-btn"
      >
        +
      </button>
    );
  }

  const pastActions = props.day.actions.past.map(t => <PastAction key={t.id} data={t} />);

  return (
    <div className="box box-date">
      <span className={props.day.isToday ? 'has-text-weight-bold' : ''}>{title()}</span>
      {addActionBtn}
      <div>{pastActions}</div>
    </div>
  );
});

export default Day;
