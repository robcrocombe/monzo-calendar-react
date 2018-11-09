import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div className="app">
    <h1>Hello Parcel x React</h1>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
