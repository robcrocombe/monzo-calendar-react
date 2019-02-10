import React from 'react';
import { formatCurrency } from '../common/utils';

interface Props {
  data: monzo.Transaction;
}

export default function PastAction(props: Props) {
  let value = formatCurrency(props.data.amount, props.data.currency);
  if (props.data.amount > 0) {
    value = `+${value}`;
  }

  return (
    <div className={`tag ${props.data.category}`}>
      <span className="truncate">{props.data.category}</span>
      <span>{value}</span>
    </div>
  );
}
