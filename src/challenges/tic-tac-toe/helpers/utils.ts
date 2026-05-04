import { config } from '../config';
import type { Board, Cell, Mark } from './types';

/** Create a fresh empty 3×3 board. */
export function getEmptyBoard(): Board {
  return Array.from({ length: config.stateRows }, () =>
    Array.from({ length: config.stateCols }, () => '-' as Mark),
  ) as Board;
}

export function getEmptyBoardWithMove(player: Mark): Board {
  const board = getEmptyBoard();
  const move = getRandomMove(board);
  return applyMove(
    board,
    [Math.floor(move / config.stateCols), move % config.stateCols],
    player,
  );
}

/** Encode board as a string key for the Q-table map. */
export function getBoardKey(board: Board): string {
  return board.flat().join('');
}

/** Returns [row, col] pairs of all empty cells. */
export function getEmptyCellsList(board: Board): number[] {
  const cells = [];
  for (let r = 0; r < config.stateRows; r++) {
    for (let c = 0; c < config.stateCols; c++) {
      if (board[r][c] === '-') {
        cells.push(r * config.stateCols + c);
      }
    }
  }
  return cells;
}

/** Apply a move and return a new board (immutable). */
export function applyMove(board: Board, [row, col]: Cell, player: Mark): Board {
  return board.map((r, ri) =>
    r.map((cell, ci) => (ri === row && ci === col ? player : cell)),
  ) as Board;
}

/** Returns 1 if X wins, -1 if O wins, 0 for draw/ongoing. */
export function checkWinner(board: Board): Mark {
  // check rows
  for (let i = 0; i < config.stateRows; i++) {
    const first = board[i][0];
    if (first !== '-' && board[i].every((cell) => cell === first)) {
      return first;
    }
  }

  // check columns
  for (let i = 0; i < config.stateCols; i++) {
    const first = board[0][i];
    if (first !== '-' && board.every((row) => row[i] === first)) {
      return first;
    }
  }

  // check main diagonal
  const first = board[0][0];
  if (first !== '-' && board.every((row, i) => row[i] === first)) {
    return first;
  }

  // check anti-diagonal
  const firstAnti = board[0][config.stateCols - 1];
  if (
    firstAnti !== '-' &&
    board.every((row, i) => row[config.stateCols - 1 - i] === firstAnti)
  ) {
    return firstAnti;
  }

  return '-';
}

/** True when the game is over (someone won or all cells filled). */
export function isTerminal(board: Board): boolean {
  if (checkWinner(board) !== '-') {
    return true;
  }
  return board.every((row) => row.every((cell) => cell !== '-'));
}

export function getRandomMove(board: Board): number {
  const empty = getEmptyCellsList(board);
  return empty[Math.floor(Math.random() * empty.length)];
}

export function getReward(board: Board): number {
  const winner = checkWinner(board);
  if (winner === 'O') {
    return config.winReward;
  }
  if (winner === 'X') {
    return config.lossReward;
  }
  if (isTerminal(board)) {
    return config.drawReward;
  }

  return 0;
}
