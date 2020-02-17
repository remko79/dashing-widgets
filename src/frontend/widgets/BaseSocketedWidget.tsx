import * as React from 'react';
import { Widget as BaseWidget, IState as BaseState, IProps as BaseProps } from './BaseWidget';
import SocketContext from '../lib/SocketContext';

export type IProps = BaseProps;
export type IState = BaseState;

abstract class BaseSocketedWidget<P extends IProps, S extends IState> extends BaseWidget<P, S> {
  static contextType = SocketContext;

  context!: React.ContextType<typeof SocketContext>;

  abstract getWidgetUpdateEventName(): string;

  componentDidMount() {
    const { socket } = this.context;
    if (!socket) {
      return;
    }
    socket.on(`widget:update:${this.getWidgetUpdateEventName()}`, (result) => {
      if (result.schedule) {
        this.setOutdatedTimeInSeconds(result.schedule.timeout);
      }
      if (result.date) {
        this.setUpdateTime(result.date);
      }
      this.updateWidget(result);
    });
  }
}

export default BaseSocketedWidget;
