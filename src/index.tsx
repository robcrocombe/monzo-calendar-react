import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
if ((module as any).hot) {
  (module as any).hot.accept();
}
