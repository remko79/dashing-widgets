import * as React from 'react';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { IOnCallsResult } from '../../../backend/types/OpsGenie';

import './widget.scss';

interface IProps {
  alias: string;
}

interface IState {
  names: string[];
}

class OnCall extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  getWidgetClassName = () => 'oncall';

  getWidgetUpdateEventName = () => 'opsgenie-oncalls';

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({ names: ['?'] });
      return;
    }
    const { onCalls }: { onCalls: IOnCallsResult[] } = result;
    const info = onCalls.filter((item) => item.key === this.props.alias);
    if (!info[0]) {
      this.updateStateWarning({ names: ['?'] });
      return;
    }
    this.updateState({ names: info[0].names });
  };

  renderContent = () => {
    const { names } = this.state;

    const displayNames = names.map((name: string) => name.replace(/@.*$/, '')).join(',');
    return (
      <span data-length={displayNames.length > 10 ? 'long' : 'normal'}>{ displayNames }</span>
    );
  };
}

export default OnCall;
