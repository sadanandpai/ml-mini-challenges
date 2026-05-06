export const gameConfig = {
  stateRows: 16,
  stateCols: 20,
  actions: [0, 1, 2, 3], // 0: up, 1: right, 2: down, 3: left
  directions: [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ],
  rewardValue: 100,
  wallPenalty: -100,
  firePenalty: -40,
  stepPenalty: -1,
  runDelay: 333,
};

export const agentConfig = {
  episodes: 10000,
  learningRate: 0.1,
  discountFactor: 0.9,
  explorationDecay: 0.995,
  minExplorationRate: 0.01,
};
