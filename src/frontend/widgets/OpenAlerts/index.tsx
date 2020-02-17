import * as React from 'react';
import { Widget as BaseWidget, Status } from '../BaseWidget';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { IOpenAlertsResult } from '../../../backend/types/OpsGenie';

import './widget.scss';

interface IProps {
  alias: string;
  thresholds?: {
    warning?: number;
    error?: number;
  }
}

interface IState {
  alertCount: number;
}

class OpenAlerts extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  static defaultProps = {
    ...BaseWidget.defaultProps,
    fullColor: true,
  };

  getWidgetClassName = () => 'openalerts';

  getWidgetUpdateEventName = () => 'opsgenie-openalerts';

  determineWidgetStatus = (count: number): Status => {
    const { thresholds } = this.props;
    const thresholdError = (thresholds && thresholds.error !== undefined) ? thresholds.error : 1;
    const thresholdWarning = (thresholds && thresholds.warning !== undefined) ? thresholds.warning : 2;
    if (count >= thresholdError) {
      return Status.ERROR;
    }
    if (count >= thresholdWarning) {
      return Status.WARNING;
    }
    return Status.OK;
  };

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({ alertCount: -1 });
      return;
    }
    const { openAlerts }: { openAlerts: IOpenAlertsResult[] } = result;
    const alertInfo = openAlerts.filter((item) => item.key === this.props.alias);
    if (!alertInfo[0]) {
      this.updateStateWarning({ alertCount: -1 });
      return;
    }
    this.updateState({ alertCount: alertInfo[0].count }, this.determineWidgetStatus(alertInfo[0].count));
  };

  renderContent = () => {
    const { alertCount } = this.state;

    return (
      <>{ alertCount === -1 ? '?' : alertCount }</>
    );
  };
}

export default OpenAlerts;
