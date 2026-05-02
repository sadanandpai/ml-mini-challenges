import type { SelectionMode } from '../types';

interface Props {
  setSelectionMode: (mode: SelectionMode) => void;
  trainAgent: () => void;
  runAgent: () => void;
  stopAgent: () => void;
  resetEnvironment: () => void;
  isAgentRunning: boolean;
  isTraining: boolean;
  agentPosition: [number, number] | null;
  hasRewards: boolean;
}

export function Controls({
  setSelectionMode,
  trainAgent,
  runAgent,
  stopAgent,
  isAgentRunning,
  resetEnvironment,
  agentPosition,
  isTraining,
  hasRewards,
}: Props) {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-4">
      <button
        onClick={() => setSelectionMode('wall')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline"
      >
        Place Wall
      </button>

      <button
        onClick={() => setSelectionMode('reward')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline"
      >
        Place Reward
      </button>

      <button
        onClick={() => setSelectionMode('fire')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500"
      >
        Place Fire
      </button>

      <button
        onClick={() => setSelectionMode('empty')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline"
      >
        Eraser
      </button>

      <button
        onClick={() => setSelectionMode('agent')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline"
      >
        Place Agent
      </button>

      <button
        className="btn btn-outline"
        onClick={trainAgent}
        disabled={isAgentRunning || !hasRewards || isTraining}
      >
        Train Agent
      </button>

      {isAgentRunning ? (
        <button onClick={stopAgent} className="btn btn-outline">
          Stop Agent
        </button>
      ) : (
        <button
          onClick={runAgent}
          className="btn btn-outline"
          disabled={agentPosition === null || !hasRewards}
        >
          Run Agent
        </button>
      )}

      <button onClick={resetEnvironment} className="btn btn-outline">
        Reset Environment
      </button>
    </div>
  );
}
