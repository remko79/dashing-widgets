import * as React from 'react';
import { DW_CONFIG } from '../fe_config';

import './DashboardOverview.scss';

export default class DashboardOverview extends React.PureComponent {
  render() {
    return (
      <div className="dashboard dashboard--overview">
        {
          DW_CONFIG.dashboards.map((dashboard) => (
            <a key={dashboard.url} className="widget" href={dashboard.url}>
              {dashboard.title}
            </a>
          ))
        }
      </div>
    );
  }
}
