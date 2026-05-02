export class AgentEnv {
  private statesCount: number;
  private qTable: number[][];
  private actions: number[];
  private rewards: number[];
  private directions: number[];
  private checkBounds: (s: number) => boolean;

  constructor(statesCount: number, actions: number[]) {
    this.statesCount = statesCount;
    this.actions = actions;
    this.rewards = Array.from({ length: statesCount }, () => 0);
    this.initializeQTable();
  }

  initializeQTable() {
    this.qTable = Array.from({ length: this.statesCount }, () =>
      Array.from({ length: this.actions.length }, () => 0),
    );
  }

  setRewards(rewards: number[]) {
    this.rewards = rewards;
  }

  setDirections(directions: number[]) {
    this.directions = directions;
  }

  setBoundaries(fn: (s: number) => boolean) {
    this.checkBounds = fn;
  }

  getAction(currentState: number, epsilon: number) {
    if (Math.random() < epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else if (
      this.qTable[currentState].every((q) => q === this.qTable[currentState][0])
    ) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      return this.actions[
        this.qTable[currentState].indexOf(
          Math.max(...this.qTable[currentState]),
        )
      ];
    }
  }

  reset() {
    this.initializeQTable();
    this.rewards = Array.from({ length: this.statesCount }, () => 0);
  }

  train(exitState: number, episodes = 100) {
    // Set hyperparameters
    const learningRate = 0.1;
    const discountFactor = 0.9;
    const explorationDecay = 0.995;
    const minExplorationRate = 0.01;
    let explorationRate = 1.0;

    for (let episode = 0; episode < episodes; episode++) {
      // Start at a random state
      let currentState = Math.floor(Math.random() * this.statesCount);

      if (!this.checkBounds(currentState)) {
        continue;
      }

      while (currentState !== exitState) {
        // 1. Choose an action (epsilon-greedy)
        const action = this.getAction(currentState, explorationRate);

        // 2. Get the next state and the reward
        let nextState = currentState + this.directions[action];
        let reward: number;

        if (!this.checkBounds(nextState)) {
          // Out of bounds: we hit a wall!
          // Get the wall penalty from the intended nextState BEFORE resetting it
          reward = this.rewards[nextState];
          nextState = currentState; // bump back to current state
        } else {
          // Valid move: get the reward of the state we arrived in
          reward = this.rewards[nextState];
        }

        const maxNextQValue = Math.max(...this.qTable[nextState]);

        // 3. Update the Q-value using the Bellman equation
        this.qTable[currentState][action] =
          (1 - learningRate) * this.qTable[currentState][action] +
          learningRate * (reward + discountFactor * maxNextQValue);

        // 4. Move to the next state
        currentState = nextState;
      }

      // Decay the exploration rate
      explorationRate = Math.max(
        minExplorationRate,
        explorationRate * explorationDecay,
      );
    }

    return this.qTable;
  }

  *run(currentState: number, exitState: number) {
    while (currentState !== exitState) {
      const action = this.getAction(currentState, 0);
      const nextState = currentState + this.directions[action];

      if (!this.checkBounds(nextState)) {
        // if action would result in an out of bounds state, choose no action
        yield 0;
        continue;
      }

      currentState = nextState;
      yield this.directions[action];
    }
  }
}
