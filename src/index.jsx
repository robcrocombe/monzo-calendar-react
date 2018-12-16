import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
  const value = this.getItem(key);
  return value && JSON.parse(value);
};

ReactDOM.render(<App />, document.getElementById('app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
