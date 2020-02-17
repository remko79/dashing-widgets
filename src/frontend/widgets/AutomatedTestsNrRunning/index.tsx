import React from 'react';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { Widget as BaseWidget } from '../BaseWidget';
import { IKatalonResult } from '../../../backend/types/Katalon';

import './widget.scss';

interface IProps {
  project: string;
}

interface IState {
  count: number;
}

class AutomatedTestsNrRunning extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  static defaultProps = {
    ...BaseWidget.defaultProps,
    fullColor: true,
  };

  getWidgetClassName = () => 'testsrunningcount';

  getWidgetUpdateEventName = () => 'katalon-executions';

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({ count: -1 });
      return;
    }

    const { projects }: {projects: IKatalonResult[]} = result;
    const filtered = projects.find((item) => item.key === this.props.project);
    if (!filtered) {
      this.updateStateWarning({ count: -1 });
      return;
    }

    this.updateState({ count: filtered.executions.length });
  };

  renderContent = () => {
    const { count } = this.state;

    return (
      <>{ count === -1 ? '?' : count }</>
    );
  };
}

export default AutomatedTestsNrRunning;
