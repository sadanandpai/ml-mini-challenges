import { useState, useRef, useEffect } from 'react';
import './one-d.css';
import { AgentEnv } from './rl';
import { Cell } from './components/cell';
import { config } from './config';
import { Controls } from './components/controls';

export function OneDAgent() {
  const [agentEnv] = useState<AgentEnv>(() => {
    const env = new AgentEnv(config.stateLength, config.actions);
    env.setDirections(config.directions);
    env.setBoundaries(config.boundaries);
    return env;
  });
  const states = Array.from({ length: config.stateLength }, (_, i) => i);
  const [selectionMode, setSelectionMode] = useState<'agent' | 'reward' | null>(
    null,
  );
  const [agentPosition, setAgentPosition] = useState<number | null>(null);
  const [rewardPosition, setRewardPosition] = useState<number | null>(null);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const isAgentRunningRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      isAgentRunningRef.current = false;
      setIsTraining(false);
    };
  }, []);

  const handleCellClick = (position: number) => {
    if (isAgentRunning || isTraining) {
      return;
    }

    if (selectionMode === 'agent') {
      setAgentPosition(position);
    } else if (selectionMode === 'reward') {
      setRewardPosition(position);
      const rewards = [...config.rewards];
      rewards[position] = config.reward;
      agentEnv.setRewards(rewards);
    }
    setSelectionMode(null);
  };

  const trainAgent = () => {
    if (rewardPosition === null) return;
    setIsTraining(true);
    agentEnv.train(rewardPosition, config.episodes);
    setIsTraining(false);
  };

  const runAgent = async () => {
    if (agentPosition === null || rewardPosition === null) {
      return;
    }

    const actions = agentEnv.run(agentPosition, rewardPosition);
    setIsAgentRunning(true);
    isAgentRunningRef.current = true;

    for (const action of actions) {
      setAgentPosition((prev) => prev + action);
      await new Promise((resolve) => setTimeout(resolve, config.runDelay));

      if (!isAgentRunningRef.current) {
        break;
      }
    }

    setIsAgentRunning(false);
    isAgentRunningRef.current = false;
  };

  const stopAgent = () => {
    setIsAgentRunning(false);
    isAgentRunningRef.current = false;
  };

  const resetEnvironment = () => {
    setAgentPosition(null);
    setRewardPosition(null);
    agentEnv?.reset();
  };

  return (
    <main>
      <h1>One D Agent</h1>

      <Controls
        setSelectionMode={setSelectionMode}
        trainAgent={trainAgent}
        runAgent={runAgent}
        stopAgent={stopAgent}
        isAgentRunning={isAgentRunning}
        resetEnvironment={resetEnvironment}
        agentPosition={agentPosition}
        rewardPosition={rewardPosition}
        isTraining={isTraining}
      />

      <div className="flex">
        {states.map((cell) => (
          <Cell
            key={cell}
            cellPosition={cell}
            agentPosition={agentPosition}
            rewardPosition={rewardPosition}
            wallPositions={config.walls}
            onClick={handleCellClick}
          />
        ))}
      </div>
    </main>
  );
}
