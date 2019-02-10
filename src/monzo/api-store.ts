import { createContext } from 'react';
import { observable, computed, action } from 'mobx';

import { authStore } from './auth-store';
import * as calService from './../calendar/calendar.service';
// import { events, Event } from './../events';

class ApiStore {
  public readonly BASE_URL = 'https://api.monzo.com';
  public errored = false;
  public sessionToken: string;
  public accountId: string;
  @observable public transactions: monzo.Transaction[];
  @observable public balance: monzo.Balance;
  @observable public loggedIn: boolean;

  constructor() {
    this.sessionToken = localStorage.getItem('session.token');
    this.accountId = localStorage.getItem('session.accountId');

    if (this.sessionToken && this.accountId) {
      this.initData();
    } else {
      const stateToken = localStorage.getItem('session.stateToken');
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      console.log(stateToken, code, state);

      this.clearStorageAfterLogin();

      if (code && state && stateToken) {
        window.history.replaceState({}, document.title, '/');

        if (state !== stateToken) {
          console.error(`State parameter '${state}' does not match '${stateToken}'`);
          return;
        }

        authStore
          .getToken(code)
          .then(res => {
            this.sessionToken = res.access_token;
            localStorage.setItem('session.token', this.sessionToken);
          })
          .then(() => this.getAccountId())
          .then(res => {
            this.accountId = res.accounts[0].id;
            localStorage.setItem('session.accountId', this.accountId);
          })
          .then(() => this.initData());
      } else {
        this.loggedIn = false;
      }
    }
  }

  @action
  public initData() {
    this.loggedIn = true;
    this.getTransactions()
      .then(res => {
        console.log(res);
        this.transactions = res.transactions})
      .catch(this.handleFetchError);
    this.getBalance()
      .then(res => {
        console.log(res);
        this.balance = res})
      .catch(this.handleFetchError);
  }

  private getTransactions(): Promise<monzo.TransactionsResponse> {
    return this.get('/transactions', {
      account_id: this.accountId,
      since: calService.getStartDate().toISOString(),
      before: calService.getEndDate().toISOString(),
    });
  }

  private getBalance(): Promise<monzo.Balance> {
    return this.get('/balance', {
      account_id: this.accountId,
    });
  }

  private getAccountId(): Promise<monzo.AccountResponse> {
    return this.get('/accounts', {
      account_type: 'uk_retail',
    });
  }

  private get<T = any>(url: string, params: Dictionary<string>): Promise<T> {
    if (params) {
      url += '?' + this.getQueryString(params);
    }

    return fetch(this.BASE_URL + url, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.sessionToken}`,
      },
    }).then(async res => {
      const body = await res.json();

      if (res.ok) {
        return body;
      }

      const err = new Error();
      err.name = body.code || res.status;
      err.message = body.message || res.statusText;
      throw err;
    });
  }

  private handleFetchError(e: Dictionary<any> & Error) {
    console.error(`${e.name}: ${e.message}`);

    if (!this.errored && e.status === 401) {
      this.errored = true;
      this.loggedIn = false;
      localStorage.removeItem('session.token');
      localStorage.removeItem('session.accountId');
    }
  }

  private getQueryString(params: Dictionary<string>): string {
    const searchParams = new URLSearchParams();
    for (const prop in params) {
      searchParams.set(prop, params[prop]);
    }
    return searchParams.toString();
  }

  private clearStorageAfterLogin() {
    localStorage.removeItem('session.token');
    localStorage.removeItem('session.accountId');
    localStorage.removeItem('session.stateToken');
    localStorage.removeItem('auth.clientId');
    localStorage.removeItem('auth.clientSecret');
  }
}

export const apiStore = new ApiStore();
export const ApiStoreContext = createContext(apiStore);
