import { useState } from 'react';
import { Graph } from './components/graph';
import { LOAN_DATA } from './helpers/data';
import { trainLogisticRegression, predict, getCost } from './helpers/utils';

export function LinearClassification() {
  const [weights, setWeights] = useState({ w1: 0, w2: 0, b: 0 });
  const [isTrained, setIsTrained] = useState(false);
  const [inputScore, setInputScore] = useState(650);
  const [inputSalary, setInputSalary] = useState(5000);
  const [prediction, setPrediction] = useState<number | null>(null);

  const handleTrain = () => {
    const trainedWeights = trainLogisticRegression(LOAN_DATA);
    setWeights(trainedWeights);
    setIsTrained(true);
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    const prob = predict(
      inputScore,
      inputSalary,
      weights.w1,
      weights.w2,
      weights.b
    );
    setPrediction(prob);
  };

  const cost = isTrained
    ? getCost(LOAN_DATA, weights.w1, weights.w2, weights.b)
    : null;

  return (
    <div className="flex flex-col items-center gap-6 mt-4 w-full max-w-4xl">
      <p className="text-muted-foreground text-center">
        Predict loan approval based on credit score and monthly salary using
        Logistic Regression.
      </p>

      <div className="flex flex-col items-center gap-4 w-full">
        <button className="btn btn-primary" onClick={handleTrain}>
          Train Model
        </button>

        <Graph data={LOAN_DATA} weights={weights} isTrained={isTrained} />

        {isTrained && (
          <div className="text-sm space-y-1 text-center">
            <p>
              <strong>Log Loss:</strong> {cost?.toFixed(4)} |{' '}
              <strong>Decision Boundary:</strong> {weights.w1.toFixed(4)}x₁ +{' '}
              {weights.w2.toFixed(4)}x₂ = {-weights.b.toFixed(4)}
            </p>
          </div>
        )}
      </div>

      <hr className="border border-gray-300 w-full" />

      <form className="flex flex-col gap-4 max-w-md" onSubmit={handlePredict}>
        <h3 className="text-xl font-semibold text-center">
          Check Loan Eligibility
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium" htmlFor="score">
              Credit Score
            </label>
            <input
              id="score"
              type="number"
              className="input input-bordered"
              value={inputScore}
              onChange={(e) => setInputScore(Number(e.target.value))}
              min={300}
              max={850}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-lg font-medium" htmlFor="salary">
              Monthly Salary ($)
            </label>
            <input
              id="salary"
              type="number"
              className="input input-bordered"
              value={inputSalary}
              onChange={(e) => setInputSalary(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        <button className="btn btn-secondary" disabled={!isTrained}>
          Predict Approval
        </button>
      </form>

      {prediction !== null && (
        <div
          className={`font-bold ${prediction >= 0.5 ? 'text-success' : 'text-error'}`}
        >
          {prediction >= 0.5
            ? `Approved (Probability: ${(prediction * 100).toFixed(2)}%)`
            : `Denied (Probability: ${(prediction * 100).toFixed(2)}%)`}
        </div>
      )}
    </div>
  );
}
