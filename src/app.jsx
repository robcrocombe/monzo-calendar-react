import React from 'react';
import NavBar from './common/nav-bar';

class App extends React.Component {
  render() {
    return (
      <div id="app" className="flex flex-column">
        <main>
          <NavBar />
          {/* <Calendar /> */}
        </main>
        <footer>
          <div className="has-text-centered">
            <a
              id="gh-link"
              className="button is-white"
              href="https://github.com/robcrocombe/monzo-calendar"
              target="_blank"
            >
              <span className="has-text-grey">
                github.com/robcrocombe/<strong>monzo-calendar</strong>
              </span>
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
