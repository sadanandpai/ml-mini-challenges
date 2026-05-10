import {
  applyMove,
  getEmptyBoard,
  getBoardKey,
  getEmptyCellsList,
  isTerminal,
  getEmptyBoardWithMove,
} from './utils';
import type { Board } from './types';
import { getOpponentMove } from './opponent';
import { agentConfig } from '../config';

// Q-learning agent for Tic-Tac-Toe game
export class TicTacToeAgent {
  private readonly rows: number;           // Board rows
  private readonly cols: number;           // Board columns
  private qTable: Map<string, number[]>;   // Q-values for each board state

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.qTable = new Map();
  }

  // Reset Q-table for new training session
  reset() {
    this.qTable = new Map();
  }

  // Get Q-values for board state, initialize if not exists
  private getQValues(boardKey: string): number[] {
    if (!this.qTable.has(boardKey)) {
      // Create Q-values for all possible positions (rows*cols)
      this.qTable.set(boardKey, new Array(this.rows * this.cols).fill(0));
    }
    return this.qTable.get(boardKey)!;
  }

  // Choose action using epsilon-greedy policy
  getAction(board: Board, epsilon: number): [number, number] {
    const empty = getEmptyCellsList(board); // Available moves

    // Exploration: random move
    if (Math.random() < epsilon) {
      const action = empty[Math.floor(Math.random() * empty.length)];
      return [Math.floor(action / this.cols), action % this.cols];
    }

    // Exploitation: choose best move based on Q-values
    const qValues = this.getQValues(getBoardKey(board));
    let maxQ = -Infinity;
    const bestActions: number[] = [];

    // Find all actions with maximum Q-value
    for (const action of empty) {
      if (qValues[action] > maxQ) {
        maxQ = qValues[action];
        bestActions.length = 0; // Clear previous best actions
        bestActions.push(action);
      } else if (qValues[action] === maxQ) {
        bestActions.push(action);
      }
    }

    // Randomly select from best actions to break ties
    const selectedAction = bestActions[Math.floor(Math.random() * bestActions.length)];
    return [Math.floor(selectedAction / this.cols), selectedAction % this.cols];
  }

  // Train agent using self-play and Q-learning
  train(isAgentFirstPlayer: boolean, getReward: (board: Board) => number) {
    let explorationRate = 1.0; // Start with full exploration

    // Training episodes
    for (let episode = 0; episode < agentConfig.episodes; episode++) {
      // Initialize game based on who goes first
      let currentBoard = isAgentFirstPlayer
        ? getEmptyBoard()
        : getEmptyBoardWithMove('X'); // Opponent moves first

      // Play game until terminal state
      while (!isTerminal(currentBoard)) {
        // 1. Choose action (epsilon-greedy)
        const [actionRow, actionCol] = this.getAction(
          currentBoard,
          explorationRate,
        );

        // 2. Execute action and observe outcome
        let nextBoard = applyMove(currentBoard, [actionRow, actionCol], 'O');
        if (!isTerminal(nextBoard)) {
          // Opponent's turn if game not over
          const [oppRow, oppCol] = getOpponentMove(nextBoard);
          nextBoard = applyMove(nextBoard, [oppRow, oppCol], 'X');
        }
        const reward = getReward(nextBoard); // Get reward for resulting state

        // 3. Update Q-value using Bellman equation
        // Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
        const maxNextQ = isTerminal(nextBoard)
          ? 0 // No future reward in terminal state
          : Math.max(...this.getQValues(getBoardKey(nextBoard)));

        const qValues = this.getQValues(getBoardKey(currentBoard));
        const actionIdx = actionRow * this.cols + actionCol; // Convert to 1D index
        qValues[actionIdx] =
          (1 - agentConfig.learningRate) * qValues[actionIdx] +
          agentConfig.learningRate *
            (reward + agentConfig.discountFactor * maxNextQ);

        // 4. Move to next state
        currentBoard = nextBoard;
      }

      // Decay exploration rate over time
      explorationRate = Math.max(
        agentConfig.minExplorationRate,
        explorationRate * agentConfig.explorationDecay,
      );
    }
  }
}
