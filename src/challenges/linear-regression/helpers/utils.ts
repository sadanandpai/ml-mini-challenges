// Normalize feature values to [0,1] range for better gradient descent convergence
function scaleData(data: Array<[number, number]>) {
  const xValues = data.map(([x]) => x);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const rangeX = maxX - minX || 1;

  return {
    minX,
    maxX,
    rangeX,
  };
}

// Train linear regression model using gradient descent
export function getRegressionLine(data: Array<[number, number]>) {
  if (data.length === 0) {
    return { w: 0, b: 0 };
  }

  const { minX, rangeX } = scaleData(data);
  const scaledData = data.map(
    ([x, y]) => [(x - minX) / rangeX, y] as [number, number]
  );

  // Gradient descent hyperparameters
  const learningRate = 0.01;
  const numIterations = 10000;
  const epsilonError = 0.001; // Early stopping threshold
  let w = 1.0; // Weight (slope)
  let b = 1.0; // Bias (intercept)

  // Initialize cost for convergence check
  let prevCost = getCost(scaledData, w, b);
  for (let i = 0; i < numIterations; i++) {
    // Compute gradients for weight and bias
    const dw = getDW(scaledData, w, b);
    const db = getDB(scaledData, w, b);
    // Update parameters using gradient descent
    w = w - learningRate * dw;
    b = b - learningRate * db;

    // Check for convergence
    const cost = getCost(scaledData, w, b);
    if (Math.abs(prevCost - cost) < epsilonError) {
      break;
    }
    prevCost = cost;
  }

  // Convert weights back to original data scale
  // w_scaled = w_original / range_x
  // b_scaled = b_original - w_original * min_x / range_x
  const wFinal = w / rangeX;
  const bFinal = b - (w * minX) / rangeX;

  return { w: wFinal, b: bFinal };
}

// Predict y value for given x using current parameters
function getYpred(x: number, w: number, b: number) {
  return w * x + b;
}

// Compute squared error loss for single data point
function getLoss(y: number, yPred: number) {
  return (y - yPred) ** 2;
}

// Compute gradient of loss with respect to weight w
// ∂L/∂w = (1/n) * Σ(y_pred - y) * x
function getDW(data: Array<[number, number]>, w: number, b: number) {
  const sum = data.reduce(
    (acc, [x, y]) => acc + (getYpred(x, w, b) - y) * x,
    0
  );
  return sum / data.length;
}

// Compute gradient of loss with respect to bias b
// ∂L/∂b = (1/n) * Σ(y_pred - y)
function getDB(data: Array<[number, number]>, w: number, b: number) {
  const sum = data.reduce((acc, [x, y]) => acc + (getYpred(x, w, b) - y), 0);
  return sum / data.length;
}

// Compute mean squared error cost function
// J = (1/2n) * Σ(y - y_pred)²
export function getCost(data: Array<[number, number]>, w: number, b: number) {
  const sum = data.reduce(
    (acc, [x, y]) => acc + getLoss(y, getYpred(x, w, b)),
    0
  );

  return sum / (2 * data.length);
}
