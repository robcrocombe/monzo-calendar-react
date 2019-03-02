import React from 'react';
import { formatCurrency } from '../common/utils';
import { categoryDict } from '../action/action.service';

interface Props {
  data: monzo.Transaction;
}

export default function PastAction(props: Props) {
  const category = categoryDict[props.data.category];
  let value = formatCurrency(props.data.amount, props.data.currency);
  if (props.data.amount > 0) {
    value = `+${value}`;
  }

  return (
    <div className={`tag ${props.data.category}`}>
      <span className="truncate">{category}</span>
      <span>{value}</span>
    </div>
  );
}
