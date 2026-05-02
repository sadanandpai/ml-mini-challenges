const stateLength = 10;
const actions = [0, 1];
const directions = [-1, 1];
const episodes = 25;
const reward = 100;
const wallPenalty = -100;
const stepPenalty = -1;
const runDelay = 333;

const rewards = Array.from({ length: stateLength }, () => stepPenalty);
const walls = [0, stateLength - 1];

walls.forEach((wall) => (rewards[wall] = wallPenalty));
const boundaries = (s: number) => s >= 1 && s < stateLength - 1;

export const config = {
  stateLength,
  actions,
  directions,
  boundaries,
  rewards,
  episodes,
  reward,
  wallPenalty,
  runDelay,
  walls,
};
