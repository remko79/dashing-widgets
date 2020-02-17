import * as React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Dashboard from './dashboard';
import NotFound from './dashboard/NotFound';
import DashboardOverview from './dashboard/DashboardOverview';
import { DW_CONFIG } from './fe_config';

import './styles/index.scss';

const routing = (
  <BrowserRouter>
    <Switch>
      <Route key="/" exact path="/" component={DashboardOverview} />
      {
        DW_CONFIG.dashboards.map((dashboard) => (
          <Route key={dashboard.url} exact path={dashboard.url}>
            <Dashboard config={dashboard} />
          </Route>
        ))
      }
      <Route key="notfound" component={NotFound} />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));
