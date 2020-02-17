import * as React from 'react';
import Chart from 'react-apexcharts';
import { IKatalonExecution } from '../../../backend/types/Katalon';
import * as DateUtils from '../../lib/DateUtils';

export interface IExecutions {
  executions: IKatalonExecution[];
}

class MultiChart<P extends {} & IExecutions, S extends {} & IExecutions> extends React.Component<IExecutions, S> {
  constructor(props) {
    super(props);

    this.state = {} as S;
  }

  static getDerivedStateFromProps(nextProps: IExecutions, prevState: IExecutions) {
    if (JSON.stringify(prevState.executions) !== JSON.stringify(nextProps.executions)) {
      return {
        executions: nextProps.executions,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { executions } = this.state;
    return JSON.stringify(executions) !== JSON.stringify(nextState.executions);
  }

  render() {
    const { executions } = this.state;

    const nrOfItems = 10;
    const passed = executions.map((item) => item.passedTests);
    const failed = executions.map((item) => (item.totalTests - item.passedTests));
    const durations = executions.map((item) => Math.round(item.duration / 60));
    const maxTests = Math.ceil((Math.max(...passed, ...failed) + 1) / 10) * 10;
    const maxTime = Math.ceil(((Math.max(...durations)) + 1) / 10) * 10;

    const options = {
      series: [
        {
          name: 'Passed',
          data: [...passed, ...Array(nrOfItems - passed.length).fill(0)],
          type: 'column',
        },
        {
          name: 'Failed',
          data: [...failed, ...Array(nrOfItems - failed.length).fill(0)],
          type: 'column',
        },
        {
          name: 'Duration',
          data: durations,
          type: 'line',
        },
      ],
      chart: {
        stacked: false,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: [0, 0, 2],
      },
      markers: {
        size: 4,
        colors: '#fff',
        strokeColors: '#555',
        strokeWidth: 1,
      },
      colors: ['#1b870f', '#bb0b0b', '#8c9599'],
      legend: {
        show: false,
      },
      xaxis: {
        categories: executions.map((item) => DateUtils.formatDate(item.startTime, 'DD-MMM')),
        tooltip: {
          enabled: false,
        },
      },
      yaxis: [
        {
          seriesName: 'Failed',
          min: 0,
          max: maxTests,
          show: false,
          tickAmount: 5,
        },
        {
          seriesName: 'Passed',
          min: 0,
          max: maxTests,
          title: {
            text: 'Tests',
          },
          tickAmount: 5,
        },
        {
          seriesName: 'Duration',
          opposite: true,
          min: 0,
          max: maxTime,
          title: {
            text: 'Minutes',
          },
          tickAmount: 5,
        },
      ],
    };
    return (
      <Chart key={Math.random()} options={options} series={options.series} height="110%" />
    );
  }
}

export default MultiChart;
