import type { CellType } from './types';

export const createInitialGrid = ({
  rows,
  cols,
}: {
  rows: number;
  cols: number;
}) => {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      return checkBorder({ row: r, col: c, rows, cols }) ? 'wall' : 'empty';
    }),
  );
};

export const checkBorder = ({
  row: r,
  col: c,
  rows,
  cols,
}: {
  row: number;
  col: number;
  rows: number;
  cols: number;
}) => r === 0 || r === rows - 1 || c === 0 || c === cols - 1;

export const generateRewards = (
  grid: CellType[][],
  rewardPosition: [number, number],
  reward: number,
  penalty: number,
  stepPenalty: number,
  firePenalty: number,
) => {
  const rewards = grid.map((row) =>
    row.map((cell) => {
      if (cell === 'reward') return reward;
      if (cell === 'wall') return penalty;
      if (cell === 'fire') return firePenalty;
      return stepPenalty;
    }),
  );
  rewards[rewardPosition[0]][rewardPosition[1]] = reward;
  return rewards;
};
