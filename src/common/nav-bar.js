import React from 'react';

class NavBar extends React.Component {
  render() {
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
          <div className="navbar-item" v-if="showLoginButton">
            <a v-if="hasClientVars" className="button is-primary" href="monzoLoginUrl">
              Login with Monzo
            </a>
            {/*<button v-else type="button" className="button is-primary">
              Login with Monzo
            </button>*/}
          </div>
          <div className="navbar-item" v-else>
            <button type="button" className="button">
              Log out
            </button>
          </div>
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
}

export default NavBar;
