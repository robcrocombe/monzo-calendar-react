import React, { useState } from 'react';

export default function NavBar() {
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [hasClientVars, setHasClientVars] = useState(false);
  let loginButton: React.ReactNode;

  if (showLoginButton) {
    if (hasClientVars) {
      loginButton = (
        <a className="button is-primary" href="monzoLoginUrl">
          Login with Monzo
        </a>
      );
    } else {
      loginButton = (
        <button type="button" className="button is-primary">
          Login with Monzo
        </button>
      );
    }
  } else {
    loginButton = (
      <button type="button" className="button">
        Log out
      </button>
    );
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
}