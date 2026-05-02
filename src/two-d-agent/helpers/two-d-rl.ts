export class AgentEnv {
  private rows: number;
  private cols: number;
  private qTable: number[][][]; // [row][col][action]
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
    isTerminal: (r: number, c: number) => boolean,
    episodes = 100,
  ) {
    const learningRate = 0.1;
    const discountFactor = 0.9;
    const explorationDecay = 0.995;
    const minExplorationRate = 0.01;
    let explorationRate = 1.0;

    for (let episode = 0; episode < episodes; episode++) {
      let r = Math.floor(Math.random() * this.rows);
      let c = Math.floor(Math.random() * this.cols);

      // Do not spawn out of bounds or on a terminal state
      if (!checkBounds(r, c) || isTerminal(r, c)) {
        continue;
      }

      while (!isTerminal(r, c)) {
        const action = this.getAction(r, c, explorationRate);

        let nextR = r + this.directions[action][0];
        let nextC = c + this.directions[action][1];
        let reward = rewards[r][c];

        if (!checkBounds(nextR, nextC)) {
          reward = rewards[nextR][nextC];
          nextR = r;
          nextC = c;
        }

        const maxNextQValue = Math.max(...this.qTable[nextR][nextC]);
        this.qTable[r][c][action] =
          (1 - learningRate) * this.qTable[r][c][action] +
          learningRate * (reward + discountFactor * maxNextQValue);

        r = nextR;
        c = nextC;

        if (isTerminal(r, c)) {
          // Terminal state Q-values are just the reward
          this.qTable[r][c] = Array.from(
            { length: this.actions.length },
            () => reward,
          );
        }
      }

      explorationRate = Math.max(
        minExplorationRate,
        explorationRate * explorationDecay,
      );
    }

    return this.qTable;
  }

  *run(
    position: [number, number],
    checkBounds: (r: number, c: number) => boolean,
    isTerminal: (r: number, c: number) => boolean,
  ) {
    let [r, c] = position;

    while (!isTerminal(r, c)) {
      const action = this.getAction(r, c, 0);
      const nextR = r + this.directions[action][0];
      const nextC = c + this.directions[action][1];

      if (!checkBounds(nextR, nextC)) {
        // if action would result in an out of bounds state, choose no action
        yield [0, 0];
        continue;
      }

      r = nextR;
      c = nextC;
      yield this.directions[action];
    }
  }
}
