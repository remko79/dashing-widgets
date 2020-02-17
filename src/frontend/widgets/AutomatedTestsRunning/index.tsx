import * as React from 'react';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { formatDate, getTimeSince } from '../../lib/DateUtils';
import Spinner from '../../lib/components/Spinner';
import { IKatalonExecution, IKatalonResult } from '../../../backend/types/Katalon';

import './widget.scss';

interface IProps {
  project: string;
}

interface IState {
  execution?: IKatalonExecution;
}

class AutomatedTestsRunning extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  getWidgetClassName = () => 'testsrunning';

  getWidgetUpdateEventName = () => 'katalon-executions';

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({});
      return;
    }

    const { projects }: {projects: IKatalonResult[]} = result;
    const filtered = projects.find((item) => item.key === this.props.project);
    if (!filtered) {
      this.updateState({});
      return;
    }

    this.updateState({ execution: filtered.executions[0] });
  };

  renderContent = () => {
    const { execution } = this.state;

    if (!execution) {
      return (
        <span className="no-running">No test running</span>
      );
    }

    return (
      <>
        <div className="time">
          <span>Started:</span>
          <span>{formatDate(execution.startTime, 'D MMM - H:mm')}</span>
        </div>
        <div className="time">
          <span>Running:</span>
          <span>{getTimeSince(execution.startTime)}</span>
        </div>
        <div className="tests">
          <span>Passed:</span>
          <span>{execution.passedTests}</span>
        </div>
        <div className="tests">
          <span>Failed:</span>
          <span>{execution.totalTests - execution.passedTests}</span>
        </div>
        <Spinner />
      </>
    );
  };
}

export default AutomatedTestsRunning;
