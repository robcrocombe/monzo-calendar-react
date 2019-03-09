import React from 'react';
import { formatCurrency } from '../common/utils';

interface Props {
  data: monzo.PlannedTransaction;
}

export default function PlannedAction(props: Props) {
  let value = formatCurrency(props.data.amount, props.data.currency);
  if (props.data.amount > 0) {
    value = `+${value}`;
  }

  return (
    <div className={`tag planned ${props.data.category}`}>
      <span className="truncate">{props.data.name}</span>
      <span>{value}</span>
    </div>
  );
}
