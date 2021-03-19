import React from 'react';
import MultiChart from './MultiChart';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { IKatalonExecution, IKatalonResult } from '../../../backend/types/Katalon';

import './widget.scss';

interface IProps {
  project: string;
}

interface IState {
  executions: IKatalonExecution[];
}

class AutomatedTestsGraph extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  getWidgetClassName = () => 'testsgraph';

  getWidgetUpdateEventName = () => 'katalon-executions';

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({ executions: [] });
      return;
    }

    const { projects }: { projects: IKatalonResult[] } = result;
    const filtered = projects.find((item) => item.key === this.props.project);
    if (!filtered) {
      this.updateStateWarning({ executions: [] });
      return;
    }
    if (filtered.error) {
      this.updateStateError({ executions: [] });
      return;
    }

    this.updateState({ executions: filtered.executions });
  };

  renderContent = () => {
    const { executions } = this.state;
    if (!executions) {
      return null;
    }

    return (
      <div style={{ width: '100%' }}>
        <MultiChart executions={executions} />
      </div>
    );
  };
}

export default AutomatedTestsGraph;
