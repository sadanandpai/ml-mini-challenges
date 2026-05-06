import type { LoanData } from './data';

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

function scaleData(data: LoanData[]) {
  const scores = data.map((d) => d.creditScore);
  const salaries = data.map((d) => d.monthlySalary);

  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const minSalary = Math.min(...salaries);
  const maxSalary = Math.max(...salaries);

  return {
    minScore,
    maxScore,
    rangeScore: maxScore - minScore || 1,
    minSalary,
    maxSalary,
    rangeSalary: maxSalary - minSalary || 1,
  };
}

export function trainLogisticRegression(data: LoanData[]) {
  const { minScore, rangeScore, minSalary, rangeSalary } = scaleData(data);

  // Normalize data
  const normalized = data.map((d) => ({
    x1: (d.creditScore - minScore) / rangeScore,
    x2: (d.monthlySalary - minSalary) / rangeSalary,
    y: d.approved,
  }));

  let w1 = 0.0;
  let w2 = 0.0;
  let b = 0.0;
  const lr = 0.1;
  const iterations = 5000;

  for (let i = 0; i < iterations; i++) {
    let dw1 = 0;
    let dw2 = 0;
    let db = 0;

    normalized.forEach((d) => {
      const z = w1 * d.x1 + w2 * d.x2 + b;
      const prediction = sigmoid(z);
      const error = prediction - d.y;

      dw1 += error * d.x1;
      dw2 += error * d.x2;
      db += error;
    });

    w1 -= (lr * dw1) / normalized.length;
    w2 -= (lr * dw2) / normalized.length;
    b -= (lr * db) / normalized.length;
  }

  // Rescale weights to original scale
  // w1_norm * (x1 - min1)/range1 + w2_norm * (x2 - min2)/range2 + b_norm = 0
  // (w1_norm/range1) * x1 + (w2_norm/range2) * x2 + (b_norm - w1_norm*min1/range1 - w2_norm*min2/range2) = 0

  const w1Final = w1 / rangeScore;
  const w2Final = w2 / rangeSalary;
  const bFinal =
    b - (w1 * minScore) / rangeScore - (w2 * minSalary) / rangeSalary;

  return { w1: w1Final, w2: w2Final, b: bFinal };
}

export function predict(
  creditScore: number,
  monthlySalary: number,
  w1: number,
  w2: number,
  b: number
): number {
  const z = w1 * creditScore + w2 * monthlySalary + b;
  return sigmoid(z);
}

export function getCost(data: LoanData[], w1: number, w2: number, b: number) {
  let totalLoss = 0;
  data.forEach((d) => {
    const z = w1 * d.creditScore + w2 * d.monthlySalary + b;
    const p = sigmoid(z);
    // Log loss: -(y*log(p) + (1-y)*log(1-p))
    // To avoid log(0), we clamp p
    const clampedP = Math.max(0.0001, Math.min(0.9999, p));
    totalLoss += -(
      d.approved * Math.log(clampedP) +
      (1 - d.approved) * Math.log(1 - clampedP)
    );
  });
  return totalLoss / data.length;
}

export function getDecisionBoundary(
  w1: number,
  w2: number,
  b: number,
  minX: number,
  maxX: number
) {
  // w1*x + w2*y + b = 0  => y = (-w1*x - b) / w2
  const y1 = (-w1 * minX - b) / w2;
  const y2 = (-w1 * maxX - b) / w2;

  return {
    x: [minX, maxX],
    y: [y1, y2],
  };
}
