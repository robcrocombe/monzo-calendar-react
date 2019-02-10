import { createContext } from 'react';
import { observable, computed, action } from 'mobx';
import { apiService } from './api.service';
import { formatCurrency } from '../common/utils';
import { calendarStore } from '../calendar/calendar.store';

class AccountStore {
  @observable public transactions: monzo.Transaction[];
  @observable public account: monzo.Balance;
  @observable public loggedIn: boolean;
  @observable public newBalance: number;

  constructor() {
    this.init();
  }

  @computed
  public get currentBalance() {
    if (this.account) {
      return formatCurrency(this.account.balance, this.account.currency)
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
  private init() {
    apiService
      .initAccount()
      .then(res => {
        if (res) {
          this.transactions = res.transactions;
          this.account = res.balance;
          this.loggedIn = true;

          calendarStore.setPastActions(this.transactions);
        } else {
          this.loggedIn = false;
        }
      })
      .catch(e => {
        console.error(`${e.name}: ${e.message}`);

        if (e.status === 401) {
          this.loggedIn = false;
          localStorage.removeItem('session.token');
          localStorage.removeItem('session.accountId');
        }
      });
  }
}

export const accountStore = new AccountStore();
export const AccountStoreContext = createContext(accountStore);
