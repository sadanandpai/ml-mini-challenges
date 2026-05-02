interface Props {
  setSelectionMode: (mode: 'agent' | 'reward' | null) => void;
  trainAgent: () => void;
  runAgent: () => void;
  stopAgent: () => void;
  resetEnvironment: () => void;
  isAgentRunning: boolean;
  agentPosition: number | null;
  rewardPosition: number | null;
  isTraining: boolean;
}

export function Controls({
  setSelectionMode,
  trainAgent,
  runAgent,
  stopAgent,
  isAgentRunning,
  resetEnvironment,
  agentPosition,
  rewardPosition,
  isTraining,
}: Props) {
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      <button
        onClick={() => setSelectionMode('reward')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline"
      >
        Place Reward
      </button>
      <button
        className="btn btn-outline"
        onClick={trainAgent}
        disabled={isAgentRunning || rewardPosition === null || isTraining}
      >
        Train Agent
      </button>

      <button
        onClick={() => setSelectionMode('agent')}
        disabled={isAgentRunning || isTraining}
        className="btn btn-outline"
      >
        Place Agent
      </button>

      {isAgentRunning ? (
        <button onClick={stopAgent} className="btn btn-outline">
          Stop Agent
        </button>
      ) : (
        <button
          onClick={runAgent}
          className="btn btn-outline"
          disabled={agentPosition === null || rewardPosition === null}
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
