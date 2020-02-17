import * as React from 'react';
import classNames from 'classnames';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { IEnvironment, IGitLabProjectResult } from '../../../backend/types/GitLab';
import { Widget as BaseWidget } from '../BaseWidget';

import './widget.scss';
import * as DateUtils from '../../lib/DateUtils';

interface IProps {
  projects: {
    [key: string]: {
      environments: string[];
    };
  };
  latestOnly?: boolean;
}

type ProjectEnvironments = {
  projectName: string;
  environments: IEnvironment[];
};

interface IState {
  environments: ProjectEnvironments[];
}

class EnvironmentStatus extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  static defaultProps = {
    ...BaseWidget.defaultProps,
    fullColor: true,
  };

  getWidgetClassName = () => 'environmentstatus';

  getWidgetUpdateEventName = () => 'gitlab-projectinfo';

  getFilteredEnvironments = (result: IGitLabProjectResult[]): { allOk: boolean, filtered: ProjectEnvironments[] } => {
    const { projects: cfgProjects, latestOnly } = this.props;

    let allOk = true;
    let filtered: ProjectEnvironments[] = [];
    result.forEach((project) => {
      if (!Object.prototype.hasOwnProperty.call(cfgProjects, project.key)) {
        return;
      }
      const cfgEnvs = cfgProjects[project.key].environments;
      const projectEnvs = project.environments
        .filter((env) => cfgEnvs.includes(env.name))
        .sort((a, b) => cfgEnvs.indexOf(a.name) - cfgEnvs.indexOf(b.name));
      if (projectEnvs.length === 0 || projectEnvs.some((env) => env.status !== 'SUCCESS')) {
        allOk = false;
      }
      filtered.push({
        projectName: project.name,
        environments: projectEnvs,
      });
      if (latestOnly) {
        let latestEnv: ProjectEnvironments | undefined;
        filtered.forEach((item) => {
          item.environments.forEach((env) => {
            if (!latestEnv || new Date(env.date) > new Date(latestEnv.environments[0].date)) {
              latestEnv = {
                projectName: item.projectName,
                environments: [env],
              };
            }
          });
        });
        filtered = latestEnv ? [latestEnv] : [];
      }
    });
    return {
      allOk,
      filtered,
    };
  };

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({ environments: [] });
      return;
    }

    const { allOk, filtered: environments } = this.getFilteredEnvironments(result.projects);
    if (!allOk) {
      this.updateStateWarning({ environments });
      return;
    }
    this.updateState({ environments });
  };

  showProjectEnvironments = (item: ProjectEnvironments): React.ReactNode => (
    item.environments.map((env) => (
      <li key={env.name}>
        <span className="envTitle">{`${item.projectName} - ${env.name}`}</span>
        <span className="envDate">{DateUtils.formatDate(env.date, 'D MMM - H:mm')}</span>
        <span className={`envStatus ${env.status.toLowerCase()}`}>{env.status}</span>
      </li>
    ))
  );

  renderContent = () => {
    const { latestOnly } = this.props;
    const { environments } = this.state;

    if (environments.length === 0) {
      return (<div className="no-environments">?</div>);
    }

    const classnames = classNames({
      environments: true,
      latestOnly,
    });

    return (
      <ul className={classnames}>
        { environments.map((item) => this.showProjectEnvironments(item)) }
      </ul>
    );
  };
}

export default EnvironmentStatus;
