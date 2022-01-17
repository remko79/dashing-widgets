import * as React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import NotFound from './dashboard/NotFound';
import DashboardOverview from './dashboard/DashboardOverview';
import { DW_CONFIG } from './fe_config';

import './styles/index.scss';

const routing = (
  <BrowserRouter>
    <Routes>
      <Route key="/" path="/" element={(<DashboardOverview />)} />
      {
        DW_CONFIG.dashboards.map((dashboard) => (
          <Route key={dashboard.url} path={dashboard.url} element={(<Dashboard config={dashboard} />)} />
        ))
      }
      <Route key="notfound" path="*" element={(<NotFound />)} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(routing, document.getElementById('root'));
