import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AccountStoreContext } from '../monzo/account.store';
import { AuthStoreContext } from '../monzo/auth.store';
import { LogoutModal } from './logout-modal';
import { AuthModal, AuthForm } from './auth-modal';

const NavBar = observer(() => {
  const accountStore = useContext(AccountStoreContext);
  const authStore = useContext(AuthStoreContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  let loginButton: React.ReactElement<any>;

  const [showLogoutModal, toggleLogoutModal] = useState(false);
  const closeLogoutModal = () => toggleLogoutModal(false);

  function logout() {
    localStorage.clear();
    location.reload();
  }

  const [showAuthModal, toggleAuthModal] = useState(false);
  const closeAuthModal = () => toggleAuthModal(false);

  function submitAuth(form: AuthForm) {
    setIsAuthenticating(true);
    authStore.setClientVars(form.clientId, form.clientSecret);
    location.href = authStore.loginUrl;
  }

  if (accountStore.loggedIn === true) {
    loginButton = (
      <button type="button" className="button" onClick={() => toggleLogoutModal(true)}>
        Log out
      </button>
    );
  } else if (accountStore.loggedIn === false) {
    if (authStore.hasClientVars && !isAuthenticating) {
      loginButton = (
        <a className="button is-primary" href={authStore.loginUrl}>
          Login with Monzo
        </a>
      );
    } else {
      // Show Monzo vars modal
      loginButton = (
        <button type="button" className="button is-primary" onClick={() => toggleAuthModal(true)}>
          Login with Monzo
        </button>
      );
    }
  }

  return (
    <nav className="navbar has-shadow is-light">
      <div className="navbar-brand">
        <div className="navbar-item is-size-5 has-text-weight-bold">Monzo Calendar</div>
      </div>
      <div className="navbar-item">
        Current Balance:&nbsp;
        <span className="has-text-info">{accountStore.currentBalance || '£0.00'}</span>
      </div>
      <div className="navbar-item">
        Planned Balance:&nbsp;
        <span className="has-text-info">{accountStore.plannedBalance || '£0.00'}</span>
      </div>
      <div className="navbar-item" title="Profit/Loss">
        P/L:&nbsp;
        <span
          className={
            accountStore.diffAmount > 0
              ? 'has-text-success'
              : accountStore.diffAmount < 0
              ? 'has-text-danger'
              : null
          }
        >
          {accountStore.diffBalance || '0.00'}
        </span>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">{loginButton}</div>
      </div>
      <LogoutModal visible={showLogoutModal} close={closeLogoutModal} submit={logout} />
      <AuthModal visible={showAuthModal} close={closeAuthModal} submit={submitAuth} />
    </nav>
  );
});

export default NavBar;
