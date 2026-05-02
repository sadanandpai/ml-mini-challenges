export const config = {
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
  runDelay: 333,
  episodes: 500,
  stepPenalty: -1,
};
