import { useState, useRef, useEffect } from 'react';
import { Cell } from './components/cell';
import { gameConfig } from './config';
import { Controls } from './components/controls';
import { AgentEnv } from './helpers/one-d-rl';
import { checkBoundary, getRewards, walls } from './helpers/utils';

import './styles.css';

export function OneDAgent() {
  const [agentEnv] = useState<AgentEnv>(() => {
    const env = new AgentEnv(gameConfig.stateLength, gameConfig.actions);
    env.setDirections(gameConfig.directions);
    return env;
  });
  const states = Array.from({ length: gameConfig.stateLength }, (_, i) => i);
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
    }
    setSelectionMode(null);
  };

  const trainAgent = () => {
    if (rewardPosition === null) {
      return;
    }

    setIsTraining(true);
    const rewards = getRewards(rewardPosition);
    agentEnv.train(rewardPosition, rewards, checkBoundary);
    setIsTraining(false);
  };

  const runAgent = async () => {
    if (agentPosition === null || rewardPosition === null) {
      return;
    }

    const actions = agentEnv.run(agentPosition, rewardPosition, checkBoundary);
    setIsAgentRunning(true);
    isAgentRunningRef.current = true;

    for (const action of actions) {
      setAgentPosition((prev) => prev! + action);
      await new Promise((resolve) => setTimeout(resolve, gameConfig.runDelay));

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
    <main className="one-d-agent flex flex-col items-center gap-6 mt-4">
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

      <div className="flex flex-wrap justify-center px-4">
        {states.map((cell) => (
          <Cell
            key={cell}
            cellPosition={cell}
            agentPosition={agentPosition}
            rewardPosition={rewardPosition}
            wallPositions={walls}
            onClick={handleCellClick}
          />
        ))}
      </div>
    </main>
  );
}
