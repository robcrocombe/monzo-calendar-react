import React, { useContext } from 'react';
import { AccountStoreContext } from './monzo/account.store';
import NavBar from './common/nav-bar';
import Calendar from './calendar/calendar';
import { useObserver } from 'mobx-react-lite';
import LoadingIcon from './common/loading-icon';

export default function App() {
  const accountStore = useContext(AccountStoreContext);
  const pageState = useObserver(() => {
    if (accountStore.loading) {
      return (
        <div className="loading-container">
          <LoadingIcon />
        </div>
      );
    } else {
      return <Calendar />;
    }
  });

  return (
    <React.Fragment>
      <main>
        <NavBar />
        {pageState}
      </main>
      <footer id="page-footer">
        <div className="has-text-centered">
          <a
            id="gh-link"
            className="button is-white"
            href="https://github.com/robcrocombe/monzo-calendar-react"
            target="_blank"
          >
            <span className="has-text-grey">
              github.com/robcrocombe/<strong>monzo-calendar-react</strong>
            </span>
          </a>
        </div>
      </footer>
    </React.Fragment>
  );
}
