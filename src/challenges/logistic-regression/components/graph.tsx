import { useEffect } from 'react';
import Plotly, { type Data } from 'plotly.js-dist-min';
import type { LoanData } from '../helpers/data';
import { getDecisionBoundary } from '../helpers/utils';

interface Props {
  data: LoanData[];
  weights: { w1: number; w2: number; b: number };
  isTrained: boolean;
}

export function Graph({ data, weights, isTrained }: Props) {
  const getTraceData = () => {
    const approved = data.filter((d) => d.approved === 1);
    const denied = data.filter((d) => d.approved === 0);

    const traceApproved: Data = {
      x: approved.map((d) => d.creditScore),
      y: approved.map((d) => d.monthlySalary),
      mode: 'markers',
      type: 'scatter',
      name: 'Approved',
      marker: { color: '#22c55e', size: 8 },
    };

    const traceDenied: Data = {
      x: denied.map((d) => d.creditScore),
      y: denied.map((d) => d.monthlySalary),
      mode: 'markers',
      type: 'scatter',
      name: 'Denied',
      marker: { color: '#ef4444', size: 8 },
    };

    const traces = [traceDenied, traceApproved];

    if (isTrained) {
      const minScore = Math.min(...data.map((d) => d.creditScore));
      const maxScore = Math.max(...data.map((d) => d.creditScore));
      const boundary = getDecisionBoundary(
        weights.w1,
        weights.w2,
        weights.b,
        minScore,
        maxScore
      );

      traces.push({
        x: boundary.x,
        y: boundary.y,
        mode: 'lines',
        type: 'scatter',
        name: 'Decision Boundary',
        line: { color: '#64748b', width: 2, dash: 'dash' },
      });
    }

    return traces;
  };

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const textColor = isDarkMode ? '#e2e8f0' : '#1e293b';

    Plotly.newPlot(
      'graph',
      getTraceData(),
      {
        autosize: true,
        height: 400,
        title: {
          text: 'Loan Approval: Salary vs Credit Score',
          font: { size: 16, color: textColor },
        },
        xaxis: {
          title: { text: 'Credit Score - x1', font: { color: textColor } },
          tickfont: { color: textColor },
          showgrid: true,
          zeroline: true,
          gridcolor: isDarkMode ? '#334155' : '#e2e8f0',
        },
        yaxis: {
          title: {
            text: 'Monthly Salary ($) - x2',
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
      { responsive: true, displayModeBar: false }
    );
  }, [data, weights, isTrained]);

  return (
    <div className="w-full overflow-x-auto flex justify-center">
      <div id="graph" className="w-full max-w-[600px] min-w-[300px]" />
    </div>
  );
}
