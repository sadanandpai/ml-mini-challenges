import { agentConfig } from '../config';

export class AgentEnv {
  private rows: number;
  private cols: number;
  private qTable!: number[][][]; // [row][col][action]
  private actions: number[];
  private directions: number[][]; // [dr, dc]

  constructor(
    rows: number,
    cols: number,
    actions: number[],
    directions: number[][],
  ) {
    this.rows = rows;
    this.cols = cols;
    this.actions = actions;
    this.directions = directions;
    this.initializeQTable();
  }

  initializeQTable() {
    this.qTable = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        Array.from({ length: this.actions.length }, () => 0),
      ),
    );
  }

  getAction(r: number, c: number, epsilon: number) {
    if (Math.random() < epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else if (this.qTable[r][c].every((q) => q === this.qTable[r][c][0])) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      return this.actions[
        this.qTable[r][c].indexOf(Math.max(...this.qTable[r][c]))
      ];
    }
  }

  reset() {
    this.initializeQTable();
  }

  train(
    rewards: number[][],
    checkBounds: (r: number, c: number) => boolean,
    rewardPosition: [number, number],
  ) {
    let explorationRate = 1.0;

    for (let episode = 0; episode < agentConfig.episodes; episode++) {
      let r = Math.floor(Math.random() * this.rows);
      let c = Math.floor(Math.random() * this.cols);

      // Do not spawn out of bounds or on a terminal state
      if (!checkBounds(r, c)) {
        continue;
      }

      for (let step = 0; step < 1000; step++) {
        if (r === rewardPosition[0] && c === rewardPosition[1]) {
          break;
        }

        // 1. Choose an action
        const action = this.getAction(r, c, explorationRate);

        // 2. Get the next state and the reward
        let nextR = r + this.directions[action][0];
        let nextC = c + this.directions[action][1];
        let reward: number;

        if (!checkBounds(nextR, nextC)) {
          reward = rewards[nextR]?.[nextC];
          nextR = r;
          nextC = c;
        } else {
          reward = rewards[nextR][nextC];
        }

        // 3. Update Q-value
        const maxNextQValue = Math.max(...this.qTable[nextR][nextC]);
        this.qTable[r][c][action] =
          (1 - agentConfig.learningRate) * this.qTable[r][c][action] +
          agentConfig.learningRate *
            (reward + agentConfig.discountFactor * maxNextQValue);

        // 4. Move to the next state
        r = nextR;
        c = nextC;
      }

      explorationRate = Math.max(
        agentConfig.minExplorationRate,
        explorationRate * agentConfig.explorationDecay,
      );
    }

    return this.qTable;
  }

  *run(
    position: [number, number],
    checkBounds: (r: number, c: number) => boolean,
    rewardPosition: [number, number],
    maxSteps = 250, // Prevent infinite loops
  ) {
    let [r, c] = position;
    let steps = 0;

    while (
      (r !== rewardPosition[0] || c !== rewardPosition[1]) &&
      steps < maxSteps
    ) {
      const action = this.getAction(r, c, 0); // exploration 0 = greedy
      const nextR = r + this.directions[action][0];
      const nextC = c + this.directions[action][1];

      if (!checkBounds(nextR, nextC)) {
        // Even if it's a wall, the agent "spent" a move
        yield [0, 0];
        steps++;
        // If the agent is stuck hitting a wall, we might need a way to break
        // or force a different action, but greedy will keep hitting the wall.
        continue;
      }

      r = nextR;
      c = nextC;
      yield this.directions[action];
      steps++;
    }
  }
}
