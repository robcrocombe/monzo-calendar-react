import moment from 'moment';
import { createContext } from 'react';
import { observable, computed, action } from 'mobx';
import { apiService } from './api.service';
import { formatCurrency } from '../common/utils';
// import { calendarStore } from '../calendar/calendar.store';

class AccountStore {
  @observable public transactions: Dictionary<monzo.Transaction[]> = {};
  @observable public plannedTransactions: Dictionary<monzo.PlannedTransaction[]> = {};
  @observable public account: monzo.Balance;
  @observable public loggedIn: boolean;
  @observable public newBalance: number;

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
      return formatCurrency(this.newBalance, this.account.currency);
    }
  }

  @computed
  public get diffAmount() {
    if (this.account) {
      return this.newBalance - this.account.balance;
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
    const newAction = { ...action, currency: 'GBP' };
    delete newAction.dates;

    for (let i = 0; i < action.dates.length; ++i) {
      const id = action.dates[i].date.unix();

      if (!this.plannedTransactions[id]) {
        this.plannedTransactions[id] = [];
      }
      this.plannedTransactions[id].push(newAction);
    }
  }

  @action
  private async init() {
    try {
      const res = await apiService.initAccount();

      if (res) {
        this.setTransactions(res.transactions);
        this.account = res.balance;
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
}

export const accountStore = new AccountStore();
export const AccountStoreContext = createContext(accountStore);
