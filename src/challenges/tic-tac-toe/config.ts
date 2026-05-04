export const gameConfig = {
  stateRows: 3,
  stateCols: 3,
  winReward: 100,
  drawReward: 10,
  lossReward: -100,
};

export const agentConfig = {
  episodes: 50000,
  learningRate: 0.2,
  discountFactor: 0.95,
  explorationDecay: 0.9995,
  minExplorationRate: 0.01,
};
