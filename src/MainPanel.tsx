import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame, DataM } from 'types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { processData } from './util/process';
import './css/main.css';

const Plot = createPlotlyComponent(Plotly);

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: DataM[] | null;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: null,
  };

  componentDidMount() {
    if (this.props.data.series.length > 0) {
      const series = this.props.data.series as Array<Frame>;
      const { result } = processData(series);
      this.setState({ data: result });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      const series = this.props.data.series as Array<Frame>;

      if (series.length == 0) {
        this.setState({ data: null });
        return;
      }

      const { result } = processData(series);
      this.setState({ data: result });
    }
  }

  render() {
    const { width, height } = this.props;
    const { data } = this.state;

    if (!data) return <div>No data</div>;

    return (
      <div
        style={{
          width,
          height,
          padding: 0,
        }}
      >
        <Plot
          data={data}
          layout={{
            width: width,
            height: height - 50,
            margin: {
              l: 50,
              r: 50,
              b: 0,
              t: 0,
              pad: 0,
            },
            scene: {
              aspectmode: 'auto',
              xaxis: { title: 'Visitors' },
              yaxis: {
                title: 'Avg Duration',
                // showticklabels: false,
                // type: 'log',
              },
              zaxis: { title: 'Sales Quantity' },
              camera: {
                center: { x: 0, y: 0, z: 0 },
                eye: { x: 1.46, y: 1.58, z: 0.22 },
                up: { x: 0, y: 0, z: 1 },
              },
            },
            hoverlabel: {
              align: 'right',
              padding: {
                l: 10,
                r: 10,
                t: 10,
                b: 10,
              },
            },
          }}
          config={{ displayModeBar: false }}
        />
      </div>
    );
  }
}
