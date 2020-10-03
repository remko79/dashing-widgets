import * as React from 'react';
import Chart from 'react-apexcharts';

// @ts-ignore
import svg from './chart-background.svg';

export interface ICoverage {
  name?: string;
  coverage?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class SmallCoverageChart<P extends {} & ICoverage, S extends {} & ICoverage> extends React.PureComponent<ICoverage, S> {
  constructor(props) {
    super(props);

    this.state = {} as S;
  }

  static getDerivedStateFromProps(nextProps: ICoverage, prevState: ICoverage) {
    if (prevState.name !== nextProps.name || prevState.coverage !== nextProps.coverage) {
      return {
        name: nextProps.name,
        coverage: nextProps.coverage,
      };
    }
    return null;
  }

  calculateColorStops = (coverage: ICoverage['coverage']): object[] => {
    if (!coverage || coverage < 50) {
      return [];
    }
    if (coverage < 70) {
      return [
        { offset: 0, color: '#bb0b0b' },
        { offset: ((100 / coverage) * 50), color: '#da7a12' },
      ];
    }
    return [
      { offset: 0, color: '#bb0b0b' },
      { offset: ((100 / coverage) * 50), color: '#da7a12' },
      { offset: 100, color: '#1b870f' },
    ];
  };

  render() {
    const { name, coverage } = this.state;
    if (!name) {
      return null;
    }

    const options = {
      plotOptions: {
        radialBar: {
          startAngle: -125,
          endAngle: 125,
          hollow: {
            size: '75%',
            image: `${svg}`,
            imageWidth: 100,
            imageHeight: 100,
            imageOffsetY: 5,
            imageClipped: false,
          },
          track: {
            strokeWidth: '67%',
            margin: 0,
          },
          dataLabels: {
            name: {
              offsetY: 70,
              fontSize: '16px',
              color: '#3a3e40',
            },
            value: {
              offsetY: -10,
              fontSize: '16px',
              formatter: (val: string) => `${Math.round(parseFloat(val) * 10) / 10}%`,
            },
          },
        },
      },
      colors: ['#bb0b0b'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: ['#bb0b0b'],
          colorStops: this.calculateColorStops(coverage),
        },
      },
      stroke: {
        lineCap: 'round',
      },
      labels: [name],
      margin: 0,
    };

    return (
      <Chart key={name} type="radialBar" options={options} series={[coverage]} width={220} height={220} />
    );
  }
}

export default SmallCoverageChart;
