import { agentConfig } from '../config';

// Q-learning agent for 2D grid environment
export class AgentEnv {
  private rows: number;                      // Grid height
  private cols: number;                      // Grid width
  private qTable!: number[][][];             // Q-values: [row][col][action]
  private actions: number[];                 // Possible actions (up, down, left, right)
  private directions: number[][];            // Movement deltas: [dr, dc] for each action

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

  // Initialize 3D Q-table with zeros
  initializeQTable() {
    this.qTable = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () =>
        Array.from({ length: this.actions.length }, () => 0),
      ),
    );
  }

  // Choose action using epsilon-greedy policy for 2D position
  getAction(r: number, c: number, epsilon: number) {
    if (Math.random() < epsilon) {
      // Exploration: random action
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else if (this.qTable[r][c].every((q) => q === this.qTable[r][c][0])) {
      // All Q-values equal: choose randomly to break ties
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      // Exploitation: choose action with highest Q-value
      return this.actions[
        this.qTable[r][c].indexOf(Math.max(...this.qTable[r][c]))
      ];
    }
  }

  reset() {
    this.initializeQTable();
  }

  // Train agent using Q-learning on 2D grid
  train(
    rewards: number[][],                    // Reward matrix for each cell
    checkBounds: (r: number, c: number) => boolean, // Valid position checker
    rewardPosition: [number, number],       // Goal position [row, col]
  ) {
    let explorationRate = 1.0; // Start with full exploration

    // Training episodes
    for (let episode = 0; episode < agentConfig.episodes; episode++) {
      // Start at random valid position
      let r = Math.floor(Math.random() * this.rows);
      let c = Math.floor(Math.random() * this.cols);

      // Skip invalid starting positions or terminal state
      if (!checkBounds(r, c)) {
        continue;
      }

      // Episode: navigate from start to goal with step limit
      for (let step = 0; step < 1000; step++) {
        if (r === rewardPosition[0] && c === rewardPosition[1]) {
          break; // Reached goal
        }

        // 1. Choose action (epsilon-greedy)
        const action = this.getAction(r, c, explorationRate);

        // 2. Execute action and observe outcome
        let nextR = r + this.directions[action][0];
        let nextC = c + this.directions[action][1];
        let reward: number;

        if (!checkBounds(nextR, nextC)) {
          // Hit wall: apply penalty and stay in current position
          reward = rewards[nextR]?.[nextC];
          nextR = r;
          nextC = c;
        } else {
          // Valid move: receive reward for new position
          reward = rewards[nextR][nextC];
        }

        // 3. Update Q-value using Bellman equation
        // Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
        const maxNextQValue = Math.max(...this.qTable[nextR][nextC]);
        this.qTable[r][c][action] =
          (1 - agentConfig.learningRate) * this.qTable[r][c][action] +
          agentConfig.learningRate *
            (reward + agentConfig.discountFactor * maxNextQValue);

        // 4. Move to next position
        r = nextR;
        c = nextC;
      }

      // Decay exploration rate over time
      explorationRate = Math.max(
        agentConfig.minExplorationRate,
        explorationRate * agentConfig.explorationDecay,
      );
    }

    return this.qTable;
  }

  // Execute trained policy on 2D grid (generator function)
  *run(
    position: [number, number],            // Starting position [row, col]
    checkBounds: (r: number, c: number) => boolean, // Valid position checker
    rewardPosition: [number, number],       // Goal position [row, col]
    maxSteps = 250,                         // Prevent infinite loops
  ) {
    let [r, c] = position;
    let steps = 0;

    // Navigate to goal using learned policy
    while (
      (r !== rewardPosition[0] || c !== rewardPosition[1]) &&
      steps < maxSteps
    ) {
      // Always exploit (no exploration) during execution
      const action = this.getAction(r, c, 0);
      const nextR = r + this.directions[action][0];
      const nextC = c + this.directions[action][1];

      if (!checkBounds(nextR, nextC)) {
        // Hit wall: consume move but stay in place
        yield [0, 0];
        steps++;
        continue;
      }

      // Valid move: update position and yield movement direction
      r = nextR;
      c = nextC;
      yield this.directions[action];
      steps++;
    }
  }
}
