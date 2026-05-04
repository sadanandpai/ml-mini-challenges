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

export class TicTacToeAgent {
  private readonly rows: number;
  private readonly cols: number;
  private qTable: Map<string, number[]>;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.qTable = new Map();
  }

  reset() {
    this.qTable = new Map();
  }

  private getQValues(boardKey: string): number[] {
    if (!this.qTable.has(boardKey)) {
      this.qTable.set(boardKey, new Array(this.rows * this.cols).fill(0));
    }
    return this.qTable.get(boardKey)!;
  }

  getAction(board: Board, epsilon: number): [number, number] {
    const empty = getEmptyCellsList(board);

    // Exploration
    if (Math.random() < epsilon) {
      const action = empty[Math.floor(Math.random() * empty.length)];
      return [Math.floor(action / this.cols), action % this.cols];
    }

    // Exploitation - Use the board-absolute indices
    const qValues = this.getQValues(getBoardKey(board));
    let bestAction = empty[0];
    let maxQ = -Infinity;

    for (const action of empty) {
      if (qValues[action] > maxQ) {
        maxQ = qValues[action];
        bestAction = action;
      }
    }

    return [Math.floor(bestAction / this.cols), bestAction % this.cols];
  }

  train(isAgentFirstPlayer: boolean, getReward: (board: Board) => number) {
    let explorationRate = 1.0;

    for (let episode = 0; episode < agentConfig.episodes; episode++) {
      let currentBoard = isAgentFirstPlayer
        ? getEmptyBoard()
        : getEmptyBoardWithMove('X');

      while (!isTerminal(currentBoard)) {
        // 1. Choose an action
        const [actionRow, actionCol] = this.getAction(
          currentBoard,
          explorationRate,
        );

        // 2. Get the next state and the reward
        let nextBoard = applyMove(currentBoard, [actionRow, actionCol], 'O');
        if (!isTerminal(nextBoard)) {
          const [oppRow, oppCol] = getOpponentMove(nextBoard);
          nextBoard = applyMove(nextBoard, [oppRow, oppCol], 'X');
        }
        const reward = getReward(nextBoard);

        // 3. Update Q-value
        const maxNextQ = isTerminal(nextBoard)
          ? 0
          : Math.max(...this.getQValues(getBoardKey(nextBoard)));

        const qValues = this.getQValues(getBoardKey(currentBoard));
        const actionIdx = actionRow * this.cols + actionCol;
        qValues[actionIdx] =
          (1 - agentConfig.learningRate) * qValues[actionIdx] +
          agentConfig.learningRate *
            (reward + agentConfig.discountFactor * maxNextQ);

        // 4. Move to the next state
        currentBoard = nextBoard;
      }

      explorationRate = Math.max(
        agentConfig.minExplorationRate,
        explorationRate * agentConfig.explorationDecay,
      );
    }
  }
}
