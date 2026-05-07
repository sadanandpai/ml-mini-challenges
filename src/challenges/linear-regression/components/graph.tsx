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
      marker: { size: 8, color: '#22c55e' },
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
      line: { color: '#64748b', width: 2, dash: 'dash' },
    } as Data;
  };

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const textColor = isDarkMode ? '#e2e8f0' : '#1e293b';

    Plotly.newPlot(
      'graph',
      [getDataTrace(), getLineTrace()],
      {
        autosize: true,
        height: 400,
        title: {
          text: 'House Price vs Size',
          font: { size: 16, color: textColor },
          x: 0.5,
          xanchor: 'center',
        },
        xaxis: {
          title: { text: 'Size (sq ft) - x', font: { color: textColor } },
          tickfont: { color: textColor },
          showgrid: true,
          zeroline: true,
          gridcolor: isDarkMode ? '#334155' : '#e2e8f0',
        },
        yaxis: {
          title: {
            text: 'Price (in thousands $) - y',
            font: { color: textColor },
          },
          tickfont: { color: textColor },
          showgrid: true,
          zeroline: true,
          gridcolor: isDarkMode ? '#334155' : '#e2e8f0',
        },
        showlegend: true,
        legend: { orientation: 'h', y: -0.2, font: { color: textColor } },
        margin: { t: 50, b: 80, l: 60, r: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
      },
      {
        responsive: true,
        displayModeBar: false,
      }
    );
  }, [data, weight, bias]);

  return (
    <div className="w-full overflow-x-auto flex justify-center">
      <div id="graph" className="w-full max-w-[600px] min-w-[300px]" />
    </div>
  );
}
