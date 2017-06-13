import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';

import { App } from './components';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <HashRouter>
    <Route path="/:search?" component={App}/>
  </HashRouter>
  , document.getElementById('root'));
registerServiceWorker();
