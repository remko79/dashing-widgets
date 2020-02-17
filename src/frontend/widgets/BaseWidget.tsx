import React from 'react';
import classNames from 'classnames';
import * as DateUtils from '../lib/DateUtils';
import Spinner from '../lib/components/Spinner';
import { WidgetSize } from '../../../typed_config';

export enum Status {
  UNKNOWN = 'unknown',
  ERROR = 'error',
  WARNING = 'warning',
  OK = 'ok',
}

export interface IProps {
  widgetSize?: WidgetSize;
  fullColor?: boolean;
  title: string;
}

export interface IState {
  status?: Status;
  lastUpdate?: number;
  isOutdated?: boolean;
}

export abstract class Widget<P extends {} & IProps, S extends {} & IState> extends React.PureComponent<P, S> {
  private outdateTime?: number;

  private outdatedTimerId?: number;

  static defaultProps = {
    widgetSize: 1,
    fullColor: false,
  };

  protected constructor(props) {
    super(props);

    this.state = {
      status: Status.UNKNOWN,
      lastUpdate: 0,
      isOutdated: false,
    } as S;
  }

  componentWillUnmount() {
    if (this.outdatedTimerId) {
      window.clearInterval(this.outdatedTimerId);
    }
  }

  abstract getWidgetClassName(): string;

  checkOutdated = (): void => {
    const { lastUpdate } = this.state;
    if (this.outdateTime && typeof lastUpdate === 'number') {
      if ((Date.now() - lastUpdate) > this.outdateTime) {
        this.setOutdated();
      }
    }
  };

  setOutdatedTimeInSeconds = (timeout: number): void => {
    this.outdateTime = timeout * 1000;
    if (!this.outdatedTimerId) {
      this.outdatedTimerId = window.setInterval(() => this.checkOutdated(), 5000);
    }
  };

  setOutdated = (): void => {
    this.setState({
      isOutdated: true,
    });
  };

  setUpdateTime = (date: number): void => {
    this.setState({
      lastUpdate: date,
      isOutdated: false,
    });
  };

  updateState = (newState: S, status: Status = Status.OK): void => {
    this.setState({
      ...newState,
      status,
    });
  };

  updateStateWarning = (newState: S): void => {
    this.updateState(newState, Status.WARNING);
  };

  updateStateError = (newState: S): void => {
    this.updateState(newState, Status.ERROR);
  };

  abstract updateWidget(result: any): void;

  /**
   * Render the widget content.
   */
  abstract renderContent(): React.ReactNode;

  render() {
    const { title, widgetSize, fullColor } = this.props;
    const { status, lastUpdate, isOutdated } = this.state;

    const widgetClasses = classNames({
      widget: true,
      'full-color': fullColor,
      [`widget-${this.getWidgetClassName()}`]: true,
      'widget--large': widgetSize === 3,
      'widget--medium': widgetSize === 2,
      [`widget--status-${status}`]: true,
    });

    return (
      <div className={widgetClasses}>
        <h1 className="widget-header">{title}</h1>
        <div className="widget-content">{status === Status.UNKNOWN ? <Spinner /> : this.renderContent()}</div>
        <div className="widget-footer">
          {isOutdated && <span className="outdated" />}
          {typeof lastUpdate === 'number' ? DateUtils.formatDate(lastUpdate, 'DD-MM-YYYY HH:mm:ss') : '-'}
        </div>
      </div>
    );
  }
}
