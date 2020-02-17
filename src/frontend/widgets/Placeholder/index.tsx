import React from 'react';
import classNames from 'classnames';

import './widget.scss';

export default class Placeholder extends React.PureComponent {
  render() {
    const widgetClasses = classNames({
      widget: true,
      'widget-placeholder': true,
    });

    return (
      <div className={widgetClasses} />
    );
  }
}
