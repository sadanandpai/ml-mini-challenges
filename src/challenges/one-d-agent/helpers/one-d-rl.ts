import { agentConfig } from '../config';

export class AgentEnv {
  private statesCount: number;
  private qTable: number[][];
  private actions: number[];
  private directions: number[];

  constructor(statesCount: number, actions: number[]) {
    this.statesCount = statesCount;
    this.actions = actions;
    this.initializeQTable();
  }

  initializeQTable() {
    this.qTable = Array.from({ length: this.statesCount }, () =>
      Array.from({ length: this.actions.length }, () => 0),
    );
  }

  setDirections(directions: number[]) {
    this.directions = directions;
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
  }

  train(
    exitState: number,
    rewards: number[],
    checkBounds: (s: number) => boolean,
  ) {
    let explorationRate = 1.0;

    for (let episode = 0; episode < agentConfig.episodes; episode++) {
      // Start at a random state
      let currentState = Math.floor(Math.random() * this.statesCount);

      if (!checkBounds(currentState)) {
        continue;
      }

      while (currentState !== exitState) {
        // 1. Choose an action (epsilon-greedy)
        const action = this.getAction(currentState, explorationRate);

        // 2. Get the next state and the reward
        let nextState = currentState + this.directions[action];
        let reward: number;

        if (!checkBounds(nextState)) {
          // Out of bounds: we hit a wall!
          // Get the wall penalty from the intended nextState BEFORE resetting it
          reward = rewards[nextState];
          nextState = currentState; // bump back to current state
        } else {
          // Valid move: get the reward of the state we arrived in
          reward = rewards[nextState];
        }

        // 3. Update the Q-value using the Bellman equation
        const maxNextQValue = Math.max(...this.qTable[nextState]);
        this.qTable[currentState][action] =
          (1 - agentConfig.learningRate) * this.qTable[currentState][action] +
          agentConfig.learningRate *
            (reward + agentConfig.discountFactor * maxNextQValue);

        // 4. Move to the next state
        currentState = nextState;
      }

      // Decay the exploration rate
      explorationRate = Math.max(
        agentConfig.minExplorationRate,
        explorationRate * agentConfig.explorationDecay,
      );
    }

    return this.qTable;
  }

  *run(
    agentPosition: number,
    rewardPosition: number,
    checkBounds: (s: number) => boolean,
  ) {
    while (agentPosition !== rewardPosition) {
      const action = this.getAction(agentPosition, 0);
      const nextState = agentPosition + this.directions[action];

      if (!checkBounds(nextState)) {
        // if action would result in an out of bounds state, choose no action
        yield 0;
        continue;
      }

      agentPosition = nextState;
      yield this.directions[action];
    }
  }
}
