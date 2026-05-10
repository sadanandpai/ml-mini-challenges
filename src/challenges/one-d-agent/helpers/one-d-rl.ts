import { agentConfig } from '../config';

// Q-learning agent for 1D grid environment
export class AgentEnv {
  private statesCount: number;           // Number of positions in grid
  private qTable!: number[][];           // Q-values: [state][action]
  private actions: number[];            // Possible actions (e.g., left, right)
  private directions!: number[];         // Movement deltas for each action

  constructor(statesCount: number, actions: number[]) {
    this.statesCount = statesCount;
    this.actions = actions;
    this.initializeQTable();
  }

  // Initialize Q-table with zeros
  initializeQTable() {
    this.qTable = Array.from({ length: this.statesCount }, () =>
      Array.from({ length: this.actions.length }, () => 0),
    );
  }

  setDirections(directions: number[]) {
    this.directions = directions;
  }

  // Choose action using epsilon-greedy policy
  getAction(currentState: number, epsilon: number) {
    if (Math.random() < epsilon) {
      // Exploration: random action
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else if (
      this.qTable[currentState].every((q) => q === this.qTable[currentState][0])
    ) {
      // All Q-values equal: choose randomly to break ties
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      // Exploitation: choose action with highest Q-value
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

  // Train agent using Q-learning algorithm
  train(
    exitState: number,                    // Goal state position
    rewards: number[],                    // Reward for each state
    checkBounds: (s: number) => boolean, // Valid state checker
  ) {
    let explorationRate = 1.0; // Start with full exploration

    // Training episodes
    for (let episode = 0; episode < agentConfig.episodes; episode++) {
      // Start at random valid state
      let currentState = Math.floor(Math.random() * this.statesCount);

      if (!checkBounds(currentState)) {
        continue; // Skip invalid starting positions
      }

      // Episode: navigate from start to goal
      while (currentState !== exitState) {
        // 1. Choose action (epsilon-greedy)
        const action = this.getAction(currentState, explorationRate);

        // 2. Execute action and observe outcome
        let nextState = currentState + this.directions[action];
        let reward: number;

        if (!checkBounds(nextState)) {
          // Hit wall: apply penalty and stay in current state
          reward = rewards[nextState];
          nextState = currentState;
        } else {
          // Valid move: receive reward for new state
          reward = rewards[nextState];
        }

        // 3. Update Q-value using Bellman equation
        // Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
        const maxNextQValue = Math.max(...this.qTable[nextState]);
        this.qTable[currentState][action] =
          (1 - agentConfig.learningRate) * this.qTable[currentState][action] +
          agentConfig.learningRate *
            (reward + agentConfig.discountFactor * maxNextQValue);

        // 4. Move to next state
        currentState = nextState;
      }

      // Decay exploration rate over time
      explorationRate = Math.max(
        agentConfig.minExplorationRate,
        explorationRate * agentConfig.explorationDecay,
      );
    }

    return this.qTable;
  }

  // Execute trained policy (generator function for step-by-step execution)
  *run(
    agentPosition: number,               // Starting position
    rewardPosition: number,              // Goal position
    checkBounds: (s: number) => boolean, // Valid state checker
  ) {
    // Navigate to goal using learned policy
    while (agentPosition !== rewardPosition) {
      // Always exploit (no exploration) during execution
      const action = this.getAction(agentPosition, 0);
      const nextState = agentPosition + this.directions[action];

      if (!checkBounds(nextState)) {
        // Invalid move: stay in place
        yield 0;
        continue;
      }

      // Valid move: update position and yield movement direction
      agentPosition = nextState;
      yield this.directions[action];
    }
  }
}
