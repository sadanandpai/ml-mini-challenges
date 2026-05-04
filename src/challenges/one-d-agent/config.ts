export const gameConfig = {
  stateLength: 10,
  actions: [0, 1],
  directions: [-1, 1],
  reward: 100,
  wallPenalty: -100,
  stepPenalty: -1,
  runDelay: 333,
};

export const agentConfig = {
  episodes: 25,
  learningRate: 0.1,
  discountFactor: 0.9,
  explorationDecay: 0.995,
  minExplorationRate: 0.01,
};
