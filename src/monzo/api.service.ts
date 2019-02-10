import { authStore } from './auth.store';
import { calendarStore } from '../calendar/calendar.store';

class ApiService {
  public readonly BASE_URL = 'https://api.monzo.com';
  public errored = false;
  public sessionToken: string;
  public accountId: string;

  public initAccount(): Promise<monzo.InitResponse> {
    this.sessionToken = localStorage.getItem('session.token');
    this.accountId = localStorage.getItem('session.accountId');

    if (this.sessionToken && this.accountId) {
      return this.initData();
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

        return authStore
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
        return Promise.resolve(null);
      }
    }
  }

  private initData(): Promise<monzo.InitResponse> {
    return Promise.all([this.getTransactions(), this.getBalance()]).then(res => {
      return {
        transactions: res[0] && res[0].transactions,
        balance: res[1],
      };
    });
  }

  private getTransactions(): Promise<monzo.TransactionsResponse> {
    return this.get('/transactions', {
      account_id: this.accountId,
      since: calendarStore.startDate.toISOString(),
      before: calendarStore.endDate.toISOString(),
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

export const apiService = new ApiService();
