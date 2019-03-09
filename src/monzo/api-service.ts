import { authStore } from './auth.store';
import { calendarStore } from '../calendar/calendar.store';

const BASE_URL = 'https://api.monzo.com';
let sessionToken: string;
let accountId: string;

export function initAccount(): Promise<monzo.InitResponse> {
  sessionToken = localStorage.getItem('session.token');
  accountId = localStorage.getItem('session.accountId');

  if (sessionToken && accountId) {
    return populateData();
  } else {
    const stateToken = localStorage.getItem('session.stateToken');
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    clearStorageAfterLogin();

    if (code && state && stateToken) {
      window.history.replaceState({}, document.title, '/');

      if (state !== stateToken) {
        console.error(`State parameter '${state}' does not match '${stateToken}'`);
        return Promise.resolve(null);
      }

      return authStore
        .getToken(code)
        .then(res => {
          sessionToken = res.access_token;
          localStorage.setItem('session.token', sessionToken);
        })
        .then(getAccountId)
        .then(res => {
          accountId = res.accounts[0].id;
          localStorage.setItem('session.accountId', accountId);
        })
        .then(() => populateData());
    } else {
      return Promise.resolve(null);
    }
  }
}

async function populateData(): Promise<monzo.InitResponse> {
  const res = await Promise.all([getTransactions(), getBalance()]);

  return {
    transactions: res[0] && res[0].transactions,
    balance: res[1],
  };
}

function getTransactions(): Promise<monzo.TransactionsResponse> {
  return get('/transactions', {
    account_id: accountId,
    since: calendarStore.startDate.toISOString(),
    before: calendarStore.endDate.toISOString(),
  });
}

function getBalance(): Promise<monzo.Balance> {
  return get('/balance', {
    account_id: accountId,
  });
}

function getAccountId(): Promise<monzo.AccountResponse> {
  return get('/accounts', {
    account_type: 'uk_retail',
  });
}

function get<T = any>(url: string, params: Dictionary<string>): Promise<T> {
  if (params) {
    url += '?' + getQueryString(params);
  }

  return fetch(BASE_URL + url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${sessionToken}`,
    },
  }).then(async res => {
    const body = await res.json();

    if (res.ok) {
      return body;
    }

    const err = new FetchError();
    err.name = body.code || res.status;
    err.message = body.message || res.statusText;
    err.status = res.status;
    throw err;
  });
}

function getQueryString(params: Dictionary<string>): string {
  const searchParams = new URLSearchParams();
  for (const prop in params) {
    searchParams.set(prop, params[prop]);
  }
  return searchParams.toString();
}

function clearStorageAfterLogin() {
  localStorage.removeItem('session.token');
  localStorage.removeItem('session.accountId');
  localStorage.removeItem('session.stateToken');
  localStorage.removeItem('auth.clientId');
  localStorage.removeItem('auth.clientSecret');
}

export class FetchError extends Error {
  public status: number;
}
