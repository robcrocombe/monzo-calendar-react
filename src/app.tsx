import React from 'react';
import NavBar from './common/nav-bar';
import Calendar from './calendar/calendar';

export default function App() {
  return (
    <React.Fragment>
      <main>
        <NavBar />
        <Calendar />
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
