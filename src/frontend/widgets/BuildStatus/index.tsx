import * as React from 'react';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import * as DateUtils from '../../lib/DateUtils';
import { IGitLabProjectResult } from '../../../backend/types/GitLab';

import './widget.scss';
import Spinner from '../../lib/components/Spinner';

interface IProps {
  project: string;
}
interface IState {
  pipelineStatus?: string;
  pipelineDate: string;
}

class BuildStatus extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  getWidgetClassName = () => 'buildstatus';

  getWidgetUpdateEventName = () => 'gitlab-projectinfo';

  updateWidget = (result) => {
    const { project } = this.props;
    if (result.error) {
      this.updateStateError({ pipelineDate: '' });
      return;
    }

    const pInfo: IGitLabProjectResult[] = result.projects.filter((info) => info.key === project);
    if (!pInfo.length || pInfo[0].error) {
      this.updateStateWarning({ pipelineDate: 'Unknown' });
      return;
    }

    const date = pInfo[0].buildStatus.date ? DateUtils.formatDate(pInfo[0].buildStatus.date, 'D MMM - H:mm') : '';
    if (pInfo[0].buildStatus.status === 'FAILED') {
      this.updateStateError({ pipelineDate: date, pipelineStatus: pInfo[0].buildStatus.status });
      return;
    }
    this.updateState({ pipelineDate: date, pipelineStatus: pInfo[0].buildStatus.status });
  };

  renderContent = () => {
    const { pipelineStatus, pipelineDate } = this.state;

    return (
      <>
        <span className="title">Last pipeline at:</span>
        <span className="date">{ pipelineDate }</span>
        { pipelineStatus === 'RUNNING' && <Spinner /> }
      </>
    );
  };
}

export default BuildStatus;
