import { useEffect } from 'react';
import Plotly, { type Data } from 'plotly.js-dist-min';

interface Props {
  data: Array<[number, number]>;
  weight: number;
  bias: number;
  isTrained: boolean;
}

export function Graph({ data, weight, bias, isTrained }: Props) {
  const getDataTrace = () => {
    const x = data.map((point) => point[0]);
    const y = data.map((point) => point[1]);

    return {
      x,
      y,
      type: 'scatter',
      mode: 'markers',
      marker: { size: 5, color: 'blue' },
      name: 'Data Points',
    } as Data;
  };

  const getLineTrace = () => {
    if (!isTrained) {
      return {} as Data;
    }

    const x = data.map((point) => point[0]);
    const smallestX = x.length > 0 ? x.reduce((a, b) => Math.min(a, b)) : 0;
    const largestX = x.length > 0 ? x.reduce((a, b) => Math.max(a, b)) : 0;

    return {
      x: [smallestX, largestX],
      y: [weight * smallestX + bias, weight * largestX + bias],
      type: 'scatter',
      mode: 'lines',
      name: 'Min loss line',
      line: { dash: 'solid', width: 2, color: 'red' },
    } as Data;
  };

  useEffect(() => {
    Plotly.newPlot(
      'graph',
      [getDataTrace(), getLineTrace()],
      {
        width: 600,
        height: 400,
        title: {
          text: 'House Price vs Size',
          font: { size: 16 },
          x: 0.5,
          xanchor: 'center',
        },
        xaxis: {
          title: {
            text: 'Size (sq ft)',
            font: { size: 12 },
          },
          showgrid: true,
          zeroline: true,
        },
        yaxis: {
          title: {
            text: 'Price (in thousands $)',
            font: { size: 12 },
          },
          showgrid: true,
          zeroline: true,
        },
        // Legend positioning logic:
        showlegend: true,
        legend: {
          orientation: 'h', // Horizontal layout
          yanchor: 'bottom',
          y: 1, // Position slightly above the plot area
          xanchor: 'right',
          x: 1, // Align to the right edge of the chart
        },
        margin: { t: 50, b: 50, l: 60, r: 20 }, // Adjust margins so labels aren't cut off
      },
      {
        responsive: true,
        displayModeBar: false,
      }
    );
  }, [data, weight, bias]);

  return (
    <>
      <div id="graph" />
    </>
  );
}
