import * as React from 'react';
import classNames from 'classnames';

import './Screensaver.scss';

interface IProps {
  enabled: boolean;
}

interface IState {
  disabled: boolean;
  enabled: boolean;
}

class ScreenSaver extends React.PureComponent<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      disabled: true,
      enabled: false,
    };
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
    const { enabled } = this.state;

    if (prevState.enabled && !enabled) {
      setTimeout(() => {
        this.setState({ disabled: true });
      }, 2000); // 2 secs to match css.
    }
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState): IState {
    if (nextProps.enabled !== prevState.enabled) {
      return {
        disabled: false,
        enabled: nextProps.enabled,
      };
    }
    return prevState;
  }

  render() {
    const { enabled, disabled } = this.state;

    if (disabled) {
      return null;
    }

    const classes = classNames({
      screensaver: true,
      enabled,
    });

    return (
      <div className={classes}>
        <div className="screensaver-spinner">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }
}

export default ScreenSaver;
