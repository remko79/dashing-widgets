import * as React from 'react';
import socketIOClient from 'socket.io-client';
import classNames from 'classnames';

import SocketContext from '../lib/SocketContext';
import * as Widgets from '../widgets';

import { ICfgDashboard, ICfgWidget, WidgetType } from '../../../typed_config';
import DashboardOverview from './DashboardOverview';
import Placeholder from '../widgets/Placeholder';
import ScreenSaver from '../lib/components/Screensaver';

interface IProps {
  config: ICfgDashboard;
}

interface IState {
  screensaver: boolean;
}

class Dashboard extends React.PureComponent<IProps, IState> {
  private screensaverTimerId?: number;

  protected constructor(props) {
    super(props);

    this.state = {
      screensaver: false,
    };
  }

  componentDidMount() {
    const { config: { screensaver } } = this.props;

    if (screensaver) {
      this.screensaverTimerId = window.setInterval(
        () => this.showScreensaver(screensaver.show * 1000),
        screensaver.every * 1000,
      );
    }
  }

  componentWillUnmount() {
    if (this.screensaverTimerId) {
      window.clearInterval(this.screensaverTimerId);
    }
  }

  showScreensaver = (timeToShow: number) => {
    this.setState({ screensaver: true });
    setTimeout(() => {
      this.setState({ screensaver: false });
    }, timeToShow);
  };

  renderWidget = (widget: ICfgWidget, idx: number) => {
    switch (widget.type) {
      case WidgetType.Placeholder:
        return (<Placeholder key={idx} />);

      case WidgetType.AutomatedTestsGraph:
        return (
          <Widgets.AutomatedTestsGraph
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            project={widget.extraProps.project}
          />
        );

      case WidgetType.AutomatedTestsNrRunning:
        return (
          <Widgets.AutomatedTestsNrRunning
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            project={widget.extraProps.project}
          />
        );

      case WidgetType.AutomatedTestsRunning:
        return (
          <Widgets.AutomatedTestsRunning
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            project={widget.extraProps.project}
          />
        );

      case WidgetType.BuildStatus:
        return (
          <Widgets.BuildStatus
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            project={widget.extraProps.project}
          />
        );

      case WidgetType.CurrentTestCoverage:
        return (
          <Widgets.CurrentTestCoverage
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            projects={widget.extraProps.projects}
          />
        );

      case WidgetType.EnvironmentStatus:
        return (
          <Widgets.EnvironmentStatus
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            projects={widget.extraProps.projects}
            latestOnly={widget.extraProps.latestOnly}
          />
        );

      case WidgetType.OpenAlerts:
        return (
          <Widgets.OpenAlerts
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            alias={widget.extraProps.alias}
            thresholds={widget.extraProps.thresholds}
          />
        );

      case WidgetType.OnCall:
        return (
          <Widgets.OnCall
            key={idx}
            title={widget.title}
            widgetSize={widget.widgetSize}
            alias={widget.extraProps.alias}
          />
        );

      default:
        return null;
    }
  };

  render() {
    const { config: { widgets, columns } } = this.props;
    const { screensaver } = this.state;

    if (!widgets) {
      return <DashboardOverview />;
    }

    const socket = socketIOClient.connect();

    const classes = classNames({
      dashboard: true,
      'with-screensaver': screensaver,
      'columns-4': columns === 4,
    });

    return (
      <>
        <SocketContext.Provider value={{ socket }}>
          <div className={classes}>
            { widgets.map((widget, idx) => this.renderWidget(widget, idx)) }
          </div>
        </SocketContext.Provider>
        <ScreenSaver enabled={screensaver} />
      </>
    );
  }
}

export default Dashboard;
