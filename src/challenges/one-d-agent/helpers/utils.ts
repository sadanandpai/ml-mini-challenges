import { gameConfig } from '../config';

export const walls = [0, gameConfig.stateLength - 1];

export function getRewards(rewardPosition: number) {
  const rewards = Array.from(
    { length: gameConfig.stateLength },
    () => gameConfig.stepPenalty,
  );
  rewards[rewardPosition] = gameConfig.reward;
  walls.forEach((wall) => (rewards[wall] = gameConfig.wallPenalty));
  return rewards;
}

export function checkBoundary(s: number) {
  return s >= 1 && s < gameConfig.stateLength - 1;
}
