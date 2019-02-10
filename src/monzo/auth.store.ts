import { createContext } from 'react';
import { observable, computed, action } from 'mobx';

class AuthStore {
  public readonly REDIRECT_URL = process.env.REDIRECT_URL;
  @observable public CLIENT_ID = process.env.CLIENT_ID || localStorage.getItem('auth.clientId');
  @observable
  public CLIENT_SECRET = process.env.CLIENT_SECRET || localStorage.getItem('auth.clientSecret');

  @computed
  public get loginUrl(): string {
    const stateToken = this.setStateToken();

    return `https://auth.monzo.com/?
      client_id=${this.CLIENT_ID}
      &redirect_uri=${this.REDIRECT_URL}
      &response_type=code
      &state=${stateToken}`.replace(/\s/g, '');
  }

  public getToken(authCode: string): Promise<any> {
    const data = this.getFormData({
      grant_type: 'authorization_code',
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      redirect_uri: this.REDIRECT_URL,
      code: authCode,
    });

    return fetch('https://api.monzo.com/oauth2/token', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: data,
    }).then(res => res.json());
  }

  @computed
  public get hasClientVars(): boolean {
    return !!(this.CLIENT_ID && this.CLIENT_SECRET);
  }

  @action
  public setClientVars(clientId: string, clientSecret: string) {
    this.CLIENT_ID = clientId;
    this.CLIENT_SECRET = clientSecret;
    localStorage.setItem('auth.clientId', clientId);
    localStorage.setItem('auth.clientSecret', clientSecret);
  }

  // Generate random token
  private setStateToken(): string {
    const stateToken =
      'id-' +
      Math.random()
        .toString(36)
        .substr(2, 16);
    localStorage.setItem('session.stateToken', stateToken);
    return stateToken;
  }

  private getFormData(params: Dictionary<string>): URLSearchParams {
    const searchParams = new URLSearchParams();
    for (const prop in params) {
      searchParams.set(prop, params[prop]);
    }
    return searchParams;
  }
}

export const authStore = new AuthStore();
export const AuthStoreContext = createContext(authStore);
