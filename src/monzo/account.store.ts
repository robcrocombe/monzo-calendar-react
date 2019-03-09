import moment from 'moment';
import { createContext } from 'react';
import { observable, computed, action } from 'mobx';
import { formatCurrency } from '../common/utils';
import * as apiService from './api-service';
import { calendarStore } from '../calendar/calendar.store';
// import { calendarStore } from '../calendar/calendar.store';

class AccountStore {
  @observable public transactions: monzo.Transactions = {};
  @observable public plannedTransactions: monzo.PlannedTransactions = {};
  @observable public account: monzo.Balance;
  @observable public loggedIn: boolean;
  @observable public loading: boolean = true;
  @observable public finalBalance: number;

  constructor() {
    this.init();
  }

  @computed
  public get currentBalance() {
    if (this.account) {
      return formatCurrency(this.account.balance, this.account.currency);
    }
  }

  @computed
  public get plannedBalance() {
    if (this.account) {
      return formatCurrency(this.finalBalance, this.account.currency);
    }
  }

  @computed
  public get diffAmount() {
    if (this.account) {
      return this.finalBalance - this.account.balance;
    }
  }

  @computed
  public get diffBalance() {
    if (this.account) {
      return formatCurrency(this.diffAmount, this.account.currency, true, { symbol: '' });
    }
  }

  @action
  public addPlannedTransaction(action: monzo.TransactionForm) {
    const savedAction: monzo.PlannedTransaction = {
      name: action.name,
      category: action.category,
      amount: this.sanitizeActionAmount(action),
      currency: 'GBP',
    };

    for (let i = 0; i < action.dates.length; ++i) {
      const date = action.dates[i].date.unix();

      if (!this.plannedTransactions[date]) {
        this.plannedTransactions[date] = [];
      }
      this.plannedTransactions[date].push({
        ...savedAction,
      });
    }

    localStorage.setObject('data.actions', this.plannedTransactions);
    this.updateFinalBalance();
  }

  @action
  private async init() {
    try {
      const res = await apiService.initAccount();

      if (res) {
        this.account = res.balance;
        this.setTransactions(res.transactions);
        this.recoverPlannedTransactions();
        this.updateFinalBalance();
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    } catch (e) {
      console.error(`${e.name}: ${e.message}`);

      if (e.status < 500) {
        this.loggedIn = false;
        localStorage.removeItem('session.token');
        localStorage.removeItem('session.accountId');
      }
    }

    this.loading = false;
  }

  @action
  private setTransactions(list: monzo.Transaction[]) {
    for (let i = 0; i < list.length; ++i) {
      const action = list[i];
      const id = moment(action.created)
        .startOf('day')
        .unix();

      if (!this.transactions[id]) {
        this.transactions[id] = [];
      }
      this.transactions[id].push(action);
    }
  }

  @action
  private recoverPlannedTransactions() {
    // Reset if the month has changed
    const cachedMonth = parseInt(localStorage.getItem('data.month'));
    const currentMonth = moment().month();

    if (cachedMonth !== currentMonth) {
      this.plannedTransactions = {};
      localStorage.removeItem('data.actions');
      // This will initialize month if not already set
      localStorage.setItem('data.month', currentMonth.toString());
      return;
    }

    let actions: monzo.PlannedTransactions = localStorage.getObject('data.actions') || {};

    // Remove actions from past days
    actions = this.filterOldActions(actions);

    localStorage.setObject('data.actions', actions);
    this.plannedTransactions = actions;
  }

  @action
  private updateFinalBalance() {
    let total = this.account.balance;
    const days = Object.keys(this.plannedTransactions);

    for (let i = 0; i < days.length; ++i) {
      const dayActions = this.plannedTransactions[days[i]];

      for (let ii = 0; ii < dayActions.length; ++ii) {
        total += dayActions[ii].amount;
      }
    }

    this.finalBalance = total;
  }

  private filterOldActions(actions: monzo.PlannedTransactions) {
    return Object.keys(actions)
      .filter(unix => {
        const date = moment.unix(parseInt(unix));
        return date.isSameOrAfter(calendarStore.now, 'day');
      })
      .reduce((obj, key) => {
        obj[key] = actions[key];
        return obj;
      }, {});
  }

  private sanitizeActionAmount(action: monzo.TransactionForm): number {
    const isDebit = action.type === 'debit';
    const amount = Math.abs(action.amount);

    return (isDebit ? -amount : amount) * 100;
  }
}

export const accountStore = new AccountStore();
export const AccountStoreContext = createContext(accountStore);
