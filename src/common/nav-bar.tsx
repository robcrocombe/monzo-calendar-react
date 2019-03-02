import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AccountStoreContext } from '../monzo/account.store';
import { AuthStoreContext } from '../monzo/auth.store';
import { LogoutModal } from './logout-modal';

const NavBar = observer(() => {
  const accountStore = useContext(AccountStoreContext);
  const authStore = useContext(AuthStoreContext);
  let loginButton: React.ReactElement<any>;

  const [ showLogoutModal, setShowLogoutModal ] = useState(false);
  const closeLogoutModal = () => setShowLogoutModal(false);

  function logout() {
    // window.localStorage.clear();
    window.location.reload();
  }

  if (accountStore.loggedIn === true) {
    loginButton = (
      <button type="button" className="button" onClick={() => setShowLogoutModal(true)}>
        Log out
      </button>
    );
  } else if (accountStore.loggedIn === false) {
    if (authStore.hasClientVars) {
      loginButton = (
        <a className="button is-primary" href={authStore.loginUrl}>
          Login with Monzo
        </a>
      );
    } else {
      // Show Monzo vars modal
      loginButton = (
        <button type="button" className="button is-primary">
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
        <span className="has-text-info">{accountStore.currentBalance}</span>
      </div>
      <div className="navbar-item">
        Planned Balance:&nbsp;
        <span className="has-text-info">{accountStore.plannedBalance}</span>
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
          {accountStore.diffBalance}
        </span>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">{loginButton}</div>
      </div>
      <LogoutModal
        visible={showLogoutModal}
        close={closeLogoutModal}
        submit={logout}
      />
      {/*<auth-modal
        :visible="showAuthModal"
        @close="closeAuthModal"
        @submit="saveClientVars">
      </auth-modal>*/}
    </nav>
  );
});

export default NavBar;
