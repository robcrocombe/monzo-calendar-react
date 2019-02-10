const REDIRECT_URL = process.env.REDIRECT_URL;
let CLIENT_ID = process.env.CLIENT_ID || localStorage.getItem('auth.clientId');
let CLIENT_SECRET = process.env.CLIENT_SECRET || localStorage.getItem('auth.clientSecret');

export function loginUrl(): string {
  const stateToken = setStateToken();

  return `https://auth.monzo.com/?
    client_id=${CLIENT_ID}
    &redirect_uri=${REDIRECT_URL}
    &response_type=code
    &state=${stateToken}`.replace(/\s/g, '');
}

export function getToken(authCode: string): Promise<any> {
  const data = getFormData({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URL,
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

export function hasClientVars(): boolean {
  return !!(CLIENT_ID && CLIENT_SECRET);
}

export function setClientVars(clientId: string, clientSecret: string) {
  CLIENT_ID = clientId;
  CLIENT_SECRET = clientSecret;
  localStorage.setItem('auth.clientId', clientId);
  localStorage.setItem('auth.clientSecret', clientSecret);
}

function setStateToken(): string {
  // Generate random token
  const stateToken =
    'id-' +
    Math.random()
      .toString(36)
      .substr(2, 16);
  localStorage.setItem('session.stateToken', stateToken);
  return stateToken;
}

function getFormData(params: Dictionary<string>): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const prop in params) {
    searchParams.set(prop, params[prop]);
  }
  return searchParams;
}
