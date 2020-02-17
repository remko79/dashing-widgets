import React from 'react';
import SmallCoverageChart, { ICoverage } from './SmallCoverageChart';
import BaseSocketedWidget, { IProps as IParentProps, IState as IParentState } from '../BaseSocketedWidget';
import { Status } from '../BaseWidget';
import { IGitLabProjectResult } from '../../../backend/types/GitLab';

import './widget.scss';

interface IProps {
  projects: string[];
}

interface IState {
  coverages: ICoverage[];
}

class CurrentTestCoverage extends BaseSocketedWidget<IProps & IParentProps, IState & IParentState> {
  getWidgetClassName = () => 'currenttestcoverage';

  getWidgetUpdateEventName = () => 'gitlab-projectinfo';

  updateWidget = (result) => {
    if (result.error) {
      this.updateStateError({ coverages: [] });
      return;
    }
    const { projects }: { projects: IGitLabProjectResult[] } = result;

    const filteredProjects = projects
      .filter((item) => this.props.projects.includes(item.key))
      .sort((a, b) => this.props.projects.indexOf(a.key) - this.props.projects.indexOf(b.key));

    const coverages: ICoverage[] = [];
    let hasProjectError = false;
    filteredProjects.forEach((project: IGitLabProjectResult) => {
      if (project.error) {
        hasProjectError = true;
      }
      coverages.push({
        name: project.name,
        coverage: project.coverage.length ? project.coverage[0].value : 0,
      });
    });
    if (filteredProjects.length !== this.props.projects.length) {
      hasProjectError = true;
    }
    this.updateState({ coverages }, hasProjectError ? Status.WARNING : Status.OK);
  };

  renderContent = () => {
    const { coverages } = this.state;
    if (!coverages) {
      return null;
    }
    const width = 100 / coverages.length;
    return (
      <>
        { coverages.map((project) => (
          <div key={project.name} style={{ width: `${width}%` }}>
            <SmallCoverageChart name={project.name} coverage={project.coverage} />
          </div>
        ))}
      </>
    );
  };
}

export default CurrentTestCoverage;
