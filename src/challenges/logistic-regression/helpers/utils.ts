import type { LoanData } from './data';

// Sigmoid activation function for binary classification
// Maps any real number to [0,1] range
function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

// Normalize credit score and salary features to [0,1] range
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

// Train logistic regression model using gradient descent
export function trainLogisticRegression(data: LoanData[]) {
  const { minScore, rangeScore, minSalary, rangeSalary } = scaleData(data);

  // Normalize data
  const normalized = data.map((d) => ({
    x1: (d.creditScore - minScore) / rangeScore,
    x2: (d.monthlySalary - minSalary) / rangeSalary,
    y: d.approved,
  }));

  // Initialize model parameters
  let w1 = 0.0; // Weight for credit score
  let w2 = 0.0; // Weight for monthly salary
  let b = 0.0;  // Bias term
  const lr = 0.1;       // Learning rate
  const iterations = 5000;

  // Gradient descent training loop
  for (let i = 0; i < iterations; i++) {
    // Initialize gradient accumulators
    let dw1 = 0;
    let dw2 = 0;
    let db = 0;

    // Compute gradients for all training examples
    normalized.forEach((d) => {
      const z = w1 * d.x1 + w2 * d.x2 + b; // Linear combination
      const prediction = sigmoid(z);        // Probability prediction
      const error = prediction - d.y;        // Prediction error

      // Accumulate gradients (chain rule)
      dw1 += error * d.x1;
      dw2 += error * d.x2;
      db += error;
    });

    // Update parameters using average gradients
    w1 -= (lr * dw1) / normalized.length;
    w2 -= (lr * dw2) / normalized.length;
    b -= (lr * db) / normalized.length;
  }

  // Convert normalized weights back to original scale
  // Decision boundary: w1*x + w2*y + b = 0
  // After normalization: w1*(x-min1)/range1 + w2*(y-min2)/range2 + b = 0
  const w1Final = w1 / rangeScore;
  const w2Final = w2 / rangeSalary;
  const bFinal =
    b - (w1 * minScore) / rangeScore - (w2 * minSalary) / rangeSalary;

  return { w1: w1Final, w2: w2Final, b: bFinal };
}

// Predict loan approval probability for given input
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

// Compute binary cross-entropy loss (log loss)
// L = -(1/n) * Σ[y*log(p) + (1-y)*log(1-p)]
export function getCost(data: LoanData[], w1: number, w2: number, b: number) {
  let totalLoss = 0;
  data.forEach((d) => {
    const z = w1 * d.creditScore + w2 * d.monthlySalary + b;
    const p = sigmoid(z);
    // Log loss: -(y*log(p) + (1-y)*log(1-p))
    // Clamp probability to avoid log(0) numerical issues
    const clampedP = Math.max(0.0001, Math.min(0.9999, p));
    totalLoss += -(
      d.approved * Math.log(clampedP) +
      (1 - d.approved) * Math.log(1 - clampedP)
    );
  });
  return totalLoss / data.length;
}

// Calculate decision boundary points for visualization
// Decision boundary: w1*x + w2*y + b = 0  => y = (-w1*x - b) / w2
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
