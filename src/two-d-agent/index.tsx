import { useState, useRef, useEffect, useMemo } from 'react';
import { AgentEnv } from './helpers/two-d-rl';
import { Cell } from './components/cell';
import { config } from './config';
import { Controls } from './components/controls';
import type { CellType, SelectionMode } from './helpers/types';
import {
  checkBorder,
  createInitialGrid,
  generateRewards,
} from './helpers/utils';

export function TwoDAgent() {
  const [agentEnv] = useState<AgentEnv>(() => {
    return new AgentEnv(
      config.stateRows,
      config.stateCols,
      config.actions,
      config.directions,
    );
  });

  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null);
  const [agentPosition, setAgentPosition] = useState<[number, number] | null>(
    null,
  );
  const [rewardPosition, setRewardPosition] = useState<[number, number] | null>(
    null,
  );

  const [grid, setGrid] = useState<CellType[][]>(
    createInitialGrid({ rows: config.stateRows, cols: config.stateCols }),
  );
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const isAgentRunningRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      isAgentRunningRef.current = false;
      setIsTraining(false);
    };
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (
      isAgentRunning ||
      isTraining ||
      checkBorder({
        row: r,
        col: c,
        rows: config.stateRows,
        cols: config.stateCols,
      })
    ) {
      return;
    }

    if (selectionMode === 'agent') {
      if (grid[r][c] !== 'wall') {
        setAgentPosition([r, c]);
      }
    } else if (selectionMode === 'reward') {
      setRewardPosition([r, c]);
    } else if (
      selectionMode === 'wall' ||
      selectionMode === 'empty' ||
      selectionMode === 'fire'
    ) {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => [...row]);
        newGrid[r][c] = selectionMode;
        return newGrid;
      });
      // If we place a wall on the agent, move the agent
      if (
        selectionMode === 'wall' &&
        agentPosition?.[0] === r &&
        agentPosition?.[1] === c
      ) {
        setAgentPosition(null);
      }
    }
  };

  const checkBounds = (r: number, c: number) => {
    return (
      r >= 0 &&
      r < config.stateRows &&
      c >= 0 &&
      c < config.stateCols &&
      grid[r][c] !== 'wall'
    );
  };

  const trainAgent = async () => {
    if (!rewardPosition) {
      return;
    }

    setIsTraining(true);
    agentEnv.train(
      generateRewards(
        grid,
        rewardPosition,
        config.rewardValue,
        config.wallPenalty,
        config.stepPenalty,
        config.firePenalty,
      ),
      checkBounds,
      rewardPosition,
      config.episodes,
    );
    setIsTraining(false);
  };

  const runAgent = async () => {
    if (!agentPosition || !rewardPosition) {
      return;
    }

    const actionGenerator = agentEnv.run(
      agentPosition,
      checkBounds,
      rewardPosition,
    );

    setIsAgentRunning(true);
    isAgentRunningRef.current = true;
    for (const action of actionGenerator) {
      setAgentPosition((prev) => {
        if (!prev) return null;
        return [prev[0] + action[0], prev[1] + action[1]];
      });
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
    setGrid(
      createInitialGrid({ rows: config.stateRows, cols: config.stateCols }),
    );
    agentEnv.reset();
  };

  return (
    <main className="flex flex-col items-center gap-6 mt-4">
      <h2 className="text-3xl font-bold">2D Agent</h2>

      <Controls
        setSelectionMode={setSelectionMode}
        trainAgent={trainAgent}
        runAgent={runAgent}
        stopAgent={stopAgent}
        isAgentRunning={isAgentRunning}
        isTraining={isTraining}
        resetEnvironment={resetEnvironment}
        agentPosition={agentPosition}
        hasRewards={!!rewardPosition}
      />

      <div
        className="grid-container"
        style={{
          gridTemplateColumns: `repeat(${config.stateCols}, 1fr)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cellType, c) => (
            <Cell
              key={`${r}-${c}`}
              r={r}
              c={c}
              cellType={cellType}
              isAgent={agentPosition?.[0] === r && agentPosition?.[1] === c}
              onClick={handleCellClick}
              rewardPosition={rewardPosition}
            />
          )),
        )}
      </div>
    </main>
  );
}
