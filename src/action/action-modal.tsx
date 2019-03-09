import React, { useState, useEffect, useRef, useContext } from 'react';
import { Modal } from '../common/modal';
import { categories } from './action-utils';
import DatePicker from './date-picker';
import { AccountStoreContext } from '../monzo/account.store';

interface Props {
  open: calendar.Date;
  toggleOpen: (open: calendar.Date) => void;
}

export function ActionModal(props: Props) {
  const accountStore = useContext(AccountStoreContext);

  const [visible, setVisibility] = useState(false);
  const [invalidForm, setInvalidForm] = useState(true);
  const nameField = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(defaultFormData());

  useEffect(() => {
    setInvalidForm(!(form.name.trim() && form.amount && form.amount > 0 && form.dates.length));
  }, [form]);

  useEffect(() => {
    setVisibility(!!props.open);
    setForm({ ...form, dates: props.open && [props.open] });
  }, [props.open]);

  useEffect(() => {
    props.open && nameField.current.focus();
  }, [visible]);

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = event.currentTarget;
    const value = target.type === 'number' ? parseFloat(target.value) : target.value;
    const name = target.name;
    setForm({
      ...form,
      [name]: value,
    });
  }

  function datesChanged(dates: calendar.Date[]) {
    setForm({ ...form, dates });
  }

  function save() {
    accountStore.addPlannedTransaction(form);
    close();
  }

  function close() {
    props.toggleOpen(null);
    setForm(defaultFormData());
  }

  const body = (
    <div onKeyDown={e => e.key === 'Enter' && save()}>
      <div className="field">
        <label className="label" htmlFor="name">
          Name
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="name"
            autoComplete="off"
            ref={nameField}
            value={form.name}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="columns">
        <div className="column is-one-third">
          <label className="label" htmlFor="category">
            Category
          </label>
          <div className="select">
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="column">
          <label className="label" htmlFor="type">
            Type
          </label>
          <div className="control action-type-control">
            <label className="radio">
              <input
                type="radio"
                name="type"
                value="debit"
                defaultChecked={form.type === 'debit'}
                onChange={handleChange}
              />
              Debit
            </label>
            <label className="radio">
              <input
                type="radio"
                name="type"
                value="credit"
                defaultChecked={form.type === 'credit'}
                onChange={handleChange}
              />
              Credit
            </label>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label" htmlFor="name">
          Amount
        </label>
        <div className="control">
          <input
            className="input"
            type="number"
            name="amount"
            placeholder="£0.01"
            step="0.01"
            min="0.01"
            autoComplete="off"
            value={form.amount || ''}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mt2 mb1">
        <label className="label">Select dates</label>
        {form.dates && <DatePicker initialDates={form.dates} selectionChanged={datesChanged} />}
      </div>
    </div>
  );

  const footer = (
    <React.Fragment>
      <button className="button is-success" onClick={save} disabled={invalidForm}>
        Save
      </button>
      <button className="button" onClick={close}>
        Cancel
      </button>
    </React.Fragment>
  );

  return (
    <Modal
      title="Plan a new transaction"
      visible={visible}
      close={close}
      body={body}
      footer={footer}
    />
  );
}

function defaultFormData(): monzo.TransactionForm {
  return {
    name: '',
    category: 'general',
    type: 'debit',
    amount: 0,
    dates: [] as calendar.Date[],
  };
}
