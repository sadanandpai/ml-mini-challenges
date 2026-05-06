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

export function getRegressionLine(data: Array<[number, number]>) {
  if (data.length === 0) {
    return { w: 0, b: 0 };
  }

  const { minX, rangeX } = scaleData(data);
  const scaledData = data.map(
    ([x, y]) => [(x - minX) / rangeX, y] as [number, number]
  );

  const learningRate = 0.01;
  const numIterations = 10000;
  const epsilonError = 0.001;
  let w = 1.0;
  let b = 1.0;

  let prevCost = getCost(scaledData, w, b);
  for (let i = 0; i < numIterations; i++) {
    const dw = getDW(scaledData, w, b);
    const db = getDB(scaledData, w, b);
    w = w - learningRate * dw;
    b = b - learningRate * db;

    const cost = getCost(scaledData, w, b);
    if (Math.abs(prevCost - cost) < epsilonError) {
      break;
    }
    prevCost = cost;
  }

  // Rescale weights back to original scale
  const wFinal = w / rangeX;
  const bFinal = b - (w * minX) / rangeX;

  return { w: wFinal, b: bFinal };
}

function getYpred(x: number, w: number, b: number) {
  return w * x + b;
}

function getLoss(y: number, yPred: number) {
  return (y - yPred) ** 2;
}

function getDW(data: Array<[number, number]>, w: number, b: number) {
  const sum = data.reduce(
    (acc, [x, y]) => acc + (getYpred(x, w, b) - y) * x,
    0
  );
  return sum / data.length;
}

function getDB(data: Array<[number, number]>, w: number, b: number) {
  const sum = data.reduce((acc, [x, y]) => acc + (getYpred(x, w, b) - y), 0);
  return sum / data.length;
}

export function getCost(data: Array<[number, number]>, w: number, b: number) {
  const sum = data.reduce(
    (acc, [x, y]) => acc + getLoss(y, getYpred(x, w, b)),
    0
  );

  return sum / (2 * data.length);
}
