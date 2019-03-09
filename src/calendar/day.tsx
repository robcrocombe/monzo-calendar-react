import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import PastAction from './past-action';
import { AccountStoreContext } from '../monzo/account.store';
import PlannedAction from './planned-action';

interface Props {
  day: calendar.Date;
  addDisabled: boolean;
  openActionModal: () => void;
}

const Day = observer((props: Props) => {
  const accountStore = useContext(AccountStoreContext);
  // <past-action v-for="t in day.actions.past" :data="t"></past-action>
  // <planned-action v-for="t in day.actions.planned" :data="t"></planned-action>

  function title() {
    if (props.day.date.date() === 1) {
      return props.day.date.format('D MMM');
    }
    return props.day.date.format('D');
  }

  let addActionBtn: React.ReactElement<any>;

  if (accountStore.loggedIn && props.day.isFuture && props.day.isCurrentMonth) {
    addActionBtn = (
      <button
        onClick={props.openActionModal}
        disabled={props.addDisabled}
        type="button"
        title="Plan a transaction"
        className="button is-white is-small add-action-btn"
      >
        +
      </button>
    );
  }

  const dayId = props.day.date.unix();
  const transactions = accountStore.transactions[dayId] || [];
  const plannedTransactions = accountStore.plannedTransactions[dayId] || [];

  const pastActions = transactions.map(t => <PastAction key={t.id} data={t} />);
  const plannedActions = plannedTransactions.map((t, i) => <PlannedAction key={i} data={t} />);

  return (
    <div className="box box-date">
      <span className={props.day.isToday ? 'has-text-weight-bold' : ''}>{title()}</span>
      {addActionBtn}
      <div>{pastActions}</div>
      <div>{plannedActions}</div>
    </div>
  );
});

export default Day;
