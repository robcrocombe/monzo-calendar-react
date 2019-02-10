import React from 'react';
import { observer } from 'mobx-react-lite';
import { ApiStoreContext } from '../monzo/api-store';
import { AuthStoreContext } from '../monzo/auth-store';

const NavBar = observer(() => {
  const apiStore = React.useContext(ApiStoreContext);
  const authStore = React.useContext(AuthStoreContext);
  let loginButton: React.ReactElement<any>;

  function logout() {
    window.localStorage.clear();
    window.location.reload();
  }

  if (apiStore.loggedIn === true) {
    loginButton = (
      <button type="button" className="button" onClick={logout}>
        Log out
      </button>
    );
  } else if (apiStore.loggedIn === false) {
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
        <span className="has-text-info">currentBalance</span>
      </div>
      <div className="navbar-item">
        Planned Balance:&nbsp;
        <span className="has-text-info">plannedBalance</span>
      </div>
      <div className="navbar-item" title="Profit/Loss">
        P/L:&nbsp;
        <span>diff</span>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">{loginButton}</div>
      </div>
      {/*<auth-modal
        :visible="showAuthModal"
        @close="closeAuthModal"
        @submit="saveClientVars">
      </auth-modal>
      <logout-modal
        :visible="showLogoutModal"
        @close="closeLogoutModal"
        @submit="logout">
      </logout-modal>*/}
    </nav>
  );
});

export default NavBar;
