import { useState } from 'react';
import { Graph } from './components/graph';
import { getCost, getRegressionLine } from './helpers/utils';
import { HOUSE_PRICE_DATA } from './helpers/data';

export function LinearRegression() {
  const [weight, setWeight] = useState(0);
  const [bias, setBias] = useState(0);
  const [size, setSize] = useState(2356);
  const [prediction, setPrediction] = useState(0);
  const [isTrained, setIsTrained] = useState(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    const yPred = weight * size + bias;
    e.preventDefault();
    setPrediction(Number(yPred.toFixed(4)));
  };

  const trainModel = () => {
    const { w, b } = getRegressionLine(HOUSE_PRICE_DATA);
    setWeight(w);
    setBias(b);
    setIsTrained(true);
  };

  return (
    <div className="challenge4 flex flex-col items-center gap-6 mt-4">
      <p className="text-muted-foreground">
        Train the agent to predict the price of a house based on its size.
      </p>

      <button className="btn btn-primary" onClick={trainModel}>
        Train
      </button>

      <Graph
        data={HOUSE_PRICE_DATA}
        weight={weight}
        bias={bias}
        isTrained={isTrained}
      />

      <p>
        <strong>Mean Squared Error</strong>:{' '}
        {getCost(HOUSE_PRICE_DATA, weight, bias).toFixed(4)}
        {' | '}
        <strong>Regression Line</strong>: y = {weight.toFixed(4)}x +{' '}
        {bias.toFixed(4)}
      </p>

      <hr className="border border-gray-300 w-full" />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium" htmlFor="size">
            House Size (sq ft)
          </label>
          <input
            className="input"
            type="number"
            id="size"
            min={1000}
            max={4000}
            placeholder="House Size (sq ft)"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>

        <button className="btn btn-primary" disabled={!isTrained}>
          Predict Price
        </button>
      </form>

      {prediction !== 0 && (
        <p>Predicted House Price is {Math.round(prediction * 1000)}$</p>
      )}
    </div>
  );
}
